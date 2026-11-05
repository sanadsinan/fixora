import express from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Every route here needs a login
router.use(requireAuth);

const loadUser = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, address, role, photo_url FROM users WHERE id = ?",
    [id]
  );
  if (rows.length === 0) return null;

  const u = rows[0];
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    address: u.address || "",
    role: u.role,
    photo: u.photo_url || "",
  };
};

// ---------- Get my details ----------
router.get("/me", async (req, res) => {
  try {
    const user = await loadUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Update my details ----------
router.put("/me", async (req, res) => {
  const { name, phone, address, photo } = req.body;

  if (!name || !name.trim() || !phone || !phone.trim()) {
    return res.status(400).json({ message: "Name and phone are required." });
  }
  if (photo && (!photo.startsWith("data:image/") || photo.length > 700000)) {
    return res.status(400).json({ message: "The photo is invalid or too large." });
  }

  try {
    const fields = ["name = ?", "phone = ?", "address = ?"];
    const values = [name.trim(), phone.trim(), (address || "").trim() || null];

    // Only change the photo if the page sent one (an empty text removes it)
    if (photo !== undefined) {
      fields.push("photo_url = ?");
      values.push(photo || null);
    }
    values.push(req.user.id);

    await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);

    res.json(await loadUser(req.user.id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Change my password ----------
router.put("/me/password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters." });
  }
  if (newPassword === currentPassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from the current one." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const ok = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!ok) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      newHash,
      req.user.id,
    ]);

    res.json({ message: "Password updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;