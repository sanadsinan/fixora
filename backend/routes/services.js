import express from "express";
import pool from "../db.js";
import { requireAuth, requireProvider } from "../middleware/auth.js";

const router = express.Router();

// Every route here is for providers who are logged in
router.use(requireAuth, requireProvider);

// Checks what the provider typed. Returns an error message, or null if all is fine.
function checkInput({ name, category, price }) {
  if (!name?.trim() || !category || price === "" || price == null) {
    return "Please enter a service name, category and price.";
  }
  if (name.trim().length > 120) {
    return "The service name is too long.";
  }
  const p = Number(price);
  if (!Number.isFinite(p) || p <= 0 || p > 1000000) {
    return "Price must be a number greater than 0.";
  }
  return null;
}

// Reads one service, but only if it belongs to this provider
async function loadService(id, providerId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.description, s.price, s.status, c.name AS category
     FROM services s
     JOIN categories c ON c.id = s.category_id
     WHERE s.id = ? AND s.provider_id = ?`,
    [id, providerId]
  );
  return rows[0] || null;
}

// The shape the frontend receives
const format = (s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  description: s.description || "",
  price: Number(s.price),
  status: s.status,
});

// ---------- My services ----------
router.get("/mine", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.description, s.price, s.status, c.name AS category
       FROM services s
       JOIN categories c ON c.id = s.category_id
       WHERE s.provider_id = ?
       ORDER BY s.id`,
      [req.user.id]
    );
    res.json(rows.map(format));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Add a service ----------
router.post("/", async (req, res) => {
  const problem = checkInput(req.body);
  if (problem) return res.status(400).json({ message: problem });

  const { name, category, price, description } = req.body;

  try {
    const [cats] = await pool.query("SELECT id FROM categories WHERE name = ?", [
      category,
    ]);
    if (cats.length === 0) {
      return res.status(400).json({ message: "Unknown category." });
    }

    const [result] = await pool.query(
      `INSERT INTO services (provider_id, category_id, name, description, price)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        cats[0].id,
        name.trim(),
        (description || "").trim() || null,
        Number(price),
      ]
    );

    res.status(201).json(format(await loadService(result.insertId, req.user.id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Edit a service ----------
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const problem = checkInput(req.body);
  if (problem) return res.status(400).json({ message: problem });

  const { name, category, price, description } = req.body;

  try {
    // Make sure this service exists and belongs to me
    if (!(await loadService(id, req.user.id))) {
      return res.status(404).json({ message: "Service not found." });
    }

    const [cats] = await pool.query("SELECT id FROM categories WHERE name = ?", [
      category,
    ]);
    if (cats.length === 0) {
      return res.status(400).json({ message: "Unknown category." });
    }

    await pool.query(
      `UPDATE services
       SET category_id = ?, name = ?, description = ?, price = ?
       WHERE id = ? AND provider_id = ?`,
      [
        cats[0].id,
        name.trim(),
        (description || "").trim() || null,
        Number(price),
        id,
        req.user.id,
      ]
    );

    res.json(format(await loadService(id, req.user.id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Hide or show a service ----------
router.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!["active", "hidden"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    if (!(await loadService(id, req.user.id))) {
      return res.status(404).json({ message: "Service not found." });
    }

    await pool.query(
      "UPDATE services SET status = ? WHERE id = ? AND provider_id = ?",
      [status, id, req.user.id]
    );

    res.json(format(await loadService(id, req.user.id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Delete a service ----------
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    if (!(await loadService(id, req.user.id))) {
      return res.status(404).json({ message: "Service not found." });
    }

    await pool.query("DELETE FROM services WHERE id = ? AND provider_id = ?", [
      id,
      req.user.id,
    ]);

    res.json({ message: "Service deleted." });
  } catch (err) {
    // A service that already has bookings cannot be deleted
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "This service has bookings, so it cannot be deleted. Hide it instead.",
      });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;