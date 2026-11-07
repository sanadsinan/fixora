import express from "express";
import pool from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Every route in this file is for admins only
router.use(requireAuth, requireRole("admin"));

// ===================== Users and providers =====================

const USER_SELECT = `
  SELECT u.id, u.name, u.email, u.status AS account_status,
         p.approval_status, c.name AS category
  FROM users u
  LEFT JOIN provider_profiles p ON p.user_id = u.id
  LEFT JOIN categories c ON c.id = p.category_id`;

// One row for the admin screens.
// status is "blocked" if the account is blocked, otherwise the provider's
// approval status, or "active" for a normal customer.
const formatUser = (u) => {
  const blocked = u.account_status === "blocked";
  const isProvider = u.approval_status !== null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    type: isProvider ? "Provider" : "Customer",
    category: u.category || "",
    blocked,
    status: blocked ? "blocked" : isProvider ? u.approval_status : "active",
  };
};

// Admins are never listed, so an admin cannot block another admin
const loadUser = async (id) => {
  const [rows] = await pool.query(
    `${USER_SELECT} WHERE u.id = ? AND u.role <> 'admin'`,
    [id]
  );
  return rows[0] ? formatUser(rows[0]) : null;
};

router.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `${USER_SELECT} WHERE u.role <> 'admin' ORDER BY u.id DESC`
    );
    res.json(rows.map(formatUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Approve or reject a provider application
router.patch("/users/:id/approval", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    const user = await loadUser(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.type !== "Provider") {
      return res.status(400).json({ message: "This account has no provider application." });
    }

    await pool.query(
      "UPDATE provider_profiles SET approval_status = ? WHERE user_id = ?",
      [status, id]
    );
    res.json(await loadUser(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Block or unblock an account
router.patch("/users/:id/blocked", async (req, res) => {
  const id = Number(req.params.id);
  const { blocked } = req.body;

  if (typeof blocked !== "boolean") {
    return res.status(400).json({ message: "Invalid request." });
  }

  try {
    if (!(await loadUser(id))) {
      return res.status(404).json({ message: "User not found." });
    }

    await pool.query("UPDATE users SET status = ? WHERE id = ?", [
      blocked ? "blocked" : "active",
      id,
    ]);
    res.json(await loadUser(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ===================== Dashboard numbers =====================

router.get("/stats", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS bookings FROM bookings");
    res.json({ bookings: Number(rows[0].bookings) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ===================== Categories =====================

const checkCategory = ({ name, description }) => {
  if (!name?.trim()) return "Please enter a category name.";
  if (name.trim().length > 80) return "The category name is too long.";
  if ((description || "").length > 255) return "The description is too long.";
  return null;
};

router.get("/categories", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.description,
              (SELECT COUNT(*) FROM provider_profiles p WHERE p.category_id = c.id) AS provider_count
       FROM categories c
       ORDER BY c.name`
    );
    res.json(
      rows.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        providerCount: Number(c.provider_count),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/categories", async (req, res) => {
  const problem = checkCategory(req.body);
  if (problem) return res.status(400).json({ message: problem });

  try {
    const [result] = await pool.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [req.body.name.trim(), (req.body.description || "").trim() || null]
    );
    res.status(201).json({
      id: result.insertId,
      name: req.body.name.trim(),
      description: (req.body.description || "").trim(),
      providerCount: 0,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "This category already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);
  const problem = checkCategory(req.body);
  if (problem) return res.status(400).json({ message: problem });

  try {
    const [result] = await pool.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [req.body.name.trim(), (req.body.description || "").trim() || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found." });
    }

    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.description,
              (SELECT COUNT(*) FROM provider_profiles p WHERE p.category_id = c.id) AS provider_count
       FROM categories c WHERE c.id = ?`,
      [id]
    );
    const c = rows[0];
    res.json({
      id: c.id,
      name: c.name,
      description: c.description || "",
      providerCount: Number(c.provider_count),
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "This category already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/categories/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json({ message: "Category deleted." });
  } catch (err) {
    // A category that providers or services use cannot be deleted
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "Providers or services use this category, so it cannot be deleted.",
      });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ===================== All bookings =====================

router.get("/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.status,
              DATE_FORMAT(b.booking_date, '%Y-%m-%d') AS date,
              s.name AS service, cu.name AS customer, pu.name AS provider
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN users cu ON cu.id = b.customer_id
       JOIN users pu ON pu.id = b.provider_id
       ORDER BY b.booking_date DESC, b.id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ===================== Reviews =====================

router.get("/reviews", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.comment, cu.name AS customer, pu.name AS provider
       FROM reviews r
       JOIN users cu ON cu.id = r.customer_id
       JOIN users pu ON pu.id = r.provider_id
       ORDER BY r.created_at DESC`
    );
    res.json(rows.map((r) => ({ ...r, comment: r.comment || "" })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [
      Number(req.params.id),
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found." });
    }
    res.json({ message: "Review deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;