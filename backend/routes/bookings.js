import express from "express";
import pool from "../db.js";
import { requireAuth, requireRole, requireProvider } from "../middleware/auth.js";

const router = express.Router();

// Today's date as "2026-11-07", using the computer's own clock
const todayString = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// One query shape for every booking list.
// DATE_FORMAT and TIME_FORMAT send the date and time as plain text,
// so the browser's time zone cannot shift the day.
const SELECT_BOOKING = `
  SELECT b.id, b.status, b.address, b.notes,
         DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date,
         TIME_FORMAT(b.booking_time, '%H:%i') AS time,
         s.name AS service_name,
         pu.id AS provider_id, pu.name AS provider_name,
         cu.id AS customer_id, cu.name AS customer_name,
         EXISTS(SELECT 1 FROM reviews r WHERE r.booking_id = b.id) AS reviewed
  FROM bookings b
  JOIN services s ON s.id = b.service_id
  JOIN users pu ON pu.id = b.provider_id
  JOIN users cu ON cu.id = b.customer_id`;

// The shape the frontend receives
const format = (b) => ({
  id: b.id,
  status: b.status,
  date: b.date,
  time: b.time,
  address: b.address,
  notes: b.notes || "",
  service: b.service_name,
  providerId: b.provider_id,
  provider: b.provider_name,
  customerId: b.customer_id,
  customer: b.customer_name,
  reviewed: Boolean(b.reviewed),
});

const loadBooking = async (id) => {
  const [rows] = await pool.query(`${SELECT_BOOKING} WHERE b.id = ?`, [id]);
  return rows[0] ? format(rows[0]) : null;
};

// ---------- Customer: make a booking ----------
router.post("/", requireAuth, requireRole("customer"), async (req, res) => {
  const { providerId, serviceId, date, time, address, notes } = req.body;

  if (!providerId || !serviceId || !date || !time || !address?.trim()) {
    return res
      .status(400)
      .json({ message: "Please choose a service, date, time and enter your address." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < todayString()) {
    return res.status(400).json({ message: "Please choose a date from today onwards." });
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ message: "Please choose a valid time." });
  }
  if (address.trim().length > 255 || (notes || "").length > 500) {
    return res.status(400).json({ message: "The address or notes are too long." });
  }

  try {
    // The service must belong to that provider, be active, and the provider must be approved
    const [rows] = await pool.query(
      `SELECT s.id, s.provider_id
       FROM services s
       JOIN provider_profiles p ON p.user_id = s.provider_id
       JOIN users u ON u.id = s.provider_id
       WHERE s.id = ? AND s.provider_id = ? AND s.status = 'active'
         AND p.approval_status = 'approved' AND u.status = 'active'`,
      [serviceId, providerId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "This service is not available." });
    }
    if (rows[0].provider_id === req.user.id) {
      return res.status(400).json({ message: "You cannot book your own service." });
    }

    const [result] = await pool.query(
      `INSERT INTO bookings
         (customer_id, provider_id, service_id, booking_date, booking_time, address, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        providerId,
        serviceId,
        date,
        time,
        address.trim(),
        (notes || "").trim() || null,
      ]
    );

    res.status(201).json(await loadBooking(result.insertId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Customer: my bookings ----------
router.get("/mine", requireAuth, requireRole("customer"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      `${SELECT_BOOKING} WHERE b.customer_id = ?
       ORDER BY b.booking_date DESC, b.booking_time DESC`,
      [req.user.id]
    );
    res.json(rows.map(format));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Customer: cancel my booking ----------
router.patch("/:id/cancel", requireAuth, requireRole("customer"), async (req, res) => {
  const id = Number(req.params.id);

  try {
    const booking = await loadBooking(id);

    // A customer can only touch their own bookings
    if (!booking || booking.customerId !== req.user.id) {
      return res.status(404).json({ message: "Booking not found." });
    }
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res
        .status(400)
        .json({ message: "Only pending or confirmed bookings can be cancelled." });
    }

    await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [id]);
    res.json(await loadBooking(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Provider: booking requests ----------
router.get("/requests", requireAuth, requireProvider, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `${SELECT_BOOKING} WHERE b.provider_id = ?
       ORDER BY b.booking_date DESC, b.booking_time DESC`,
      [req.user.id]
    );
    res.json(rows.map(format));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Provider: accept, reject or complete ----------
// The only moves allowed: pending to confirmed or cancelled, confirmed to completed
const allowedMoves = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed"],
};

router.patch("/:id/status", requireAuth, requireProvider, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  try {
    const booking = await loadBooking(id);

    // A provider can only touch bookings made with them
    if (!booking || booking.providerId !== req.user.id) {
      return res.status(404).json({ message: "Booking not found." });
    }
    if (!(allowedMoves[booking.status] || []).includes(status)) {
      return res.status(400).json({
        message: `A ${booking.status} booking cannot be changed to ${status}.`,
      });
    }

    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
    res.json(await loadBooking(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;