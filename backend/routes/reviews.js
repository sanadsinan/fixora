import express from "express";
import pool from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ---------- Customer: review a completed booking ----------
router.post("/", requireAuth, requireRole("customer"), async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const stars = Number(rating);

  if (!bookingId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
    return res.status(400).json({ message: "Please choose a rating from 1 to 5 stars." });
  }
  if ((comment || "").length > 1000) {
    return res.status(400).json({ message: "The comment is too long." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, customer_id, provider_id, status FROM bookings WHERE id = ?",
      [bookingId]
    );
    const booking = rows[0];

    // A customer can only review their own bookings
    if (!booking || booking.customer_id !== req.user.id) {
      return res.status(404).json({ message: "Booking not found." });
    }
    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review a booking after it is completed." });
    }

    const [existing] = await pool.query(
      "SELECT 1 FROM reviews WHERE booking_id = ?",
      [booking.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "You have already reviewed this booking." });
    }

    await pool.query(
      `INSERT INTO reviews (booking_id, customer_id, provider_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [
        booking.id,
        req.user.id,
        booking.provider_id,
        stars,
        (comment || "").trim() || null,
      ]
    );

    res.status(201).json({ message: "Review saved." });
  } catch (err) {
    // Two clicks at the same moment: the UNIQUE rule in the database stops the second one
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "You have already reviewed this booking." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;