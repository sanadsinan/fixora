import jwt from "jsonwebtoken";
import pool from "../db.js";

// Runs before a protected route: checks the token and finds out who is asking
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  try {
    // Check that the account still exists and is not blocked
    const [rows] = await pool.query("SELECT status FROM users WHERE id = ?", [
      payload.id,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Please log in again." });
    }
    if (rows[0].status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked." });
    }

    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
}

// Allows only certain roles, for example requireRole("admin")
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to do this." });
    }
    next();
  };

// Allows anyone who has a provider profile (provider accounts, and customers who applied)
export async function requireProvider(req, res, next) {
  try {
    const [rows] = await pool.query(
      "SELECT 1 FROM provider_profiles WHERE user_id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(403).json({ message: "You are not a service provider." });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
}