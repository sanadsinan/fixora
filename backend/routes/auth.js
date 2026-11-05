import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// The token holds the user's id and role, and expires after 7 days
const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// ---------- Register ----------
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    role = "customer",
    category,
    experience,
    area,
    about,
  } = req.body;

  if (!name || !email || !phone || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, phone and password are required." });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }
  // Nobody can register as an admin
  if (!["customer", "provider"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }
  if (role === "provider" && (!category || !area)) {
    return res
      .status(400)
      .json({ message: "Providers must choose a category and working area." });
  }

  const connection = await pool.getConnection();
  try {
    const cleanEmail = email.trim().toLowerCase();

    const [existing] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    // A transaction: either everything is saved, or nothing is
    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), cleanEmail, phone, passwordHash, role]
    );
    const userId = result.insertId;

    if (role === "provider") {
      const [cats] = await connection.query(
        "SELECT id FROM categories WHERE name = ?",
        [category]
      );
      if (cats.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: "Unknown category." });
      }

      await connection.query(
        "INSERT INTO provider_profiles (user_id, category_id, experience_years, area, about) VALUES (?, ?, ?, ?, ?)",
        [userId, cats[0].id, Number(experience) || 0, area, about || null]
      );
    }

    await connection.commit();

    const user = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      role,
      isProvider: role === "provider",
    };
    if (role === "provider") user.approvalStatus = "pending";

    res.status(201).json({ token: createToken(user), user });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error." });
  } finally {
    connection.release();
  }
});

// ---------- Login ----------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await pool.query(
        `SELECT u.id, u.name, u.email, u.password_hash, u.role, u.status, u.photo_url,
              p.approval_status
       FROM users u
       LEFT JOIN provider_profiles p ON p.user_id = u.id
       WHERE u.email = ?`,
      [email.trim().toLowerCase()]
    );

    const user = rows[0];
    const passwordOk = user && (await bcrypt.compare(password, user.password_hash));

    // The same message for a wrong email and a wrong password, on purpose
    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (user.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    // Anyone with a provider profile counts as a provider
    const isProvider = user.role === "provider" || user.approval_status !== null;

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProvider,
      photo: user.photo_url || "",
    };
    if (isProvider) payload.approvalStatus = user.approval_status;

    res.json({ token: createToken(user), user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Who am I? (needs a token) ----------
router.get("/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.photo_url, p.approval_status
       FROM users u
       LEFT JOIN provider_profiles p ON p.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = rows[0];
    const isProvider = user.role === "provider" || user.approval_status !== null;

    const result = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProvider,
      photo: user.photo_url || "",
    };
    if (isProvider) result.approvalStatus = user.approval_status;

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;