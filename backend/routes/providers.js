import express from "express";
import pool from "../db.js";
import { requireAuth, requireRole, requireProvider } from "../middleware/auth.js";

const router = express.Router();

const ILLUSTRATIONS = [
  "plumbing",
  "electrical",
  "cleaning",
  "carpentry",
  "ac-repair",
  "painting",
];

// Collects a provider's full profile from the tables
async function loadMyProfile(userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.phone,
            c.name AS category, p.experience_years, p.area, p.about,
            u.photo_url, p.illustration, p.approval_status,
            (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.provider_id = u.id) AS rating,
            (SELECT COUNT(*) FROM reviews r WHERE r.provider_id = u.id) AS review_count
     FROM users u
     JOIN provider_profiles p ON p.user_id = u.id
     JOIN categories c ON c.id = p.category_id
     WHERE u.id = ?`,
    [userId]
  );
  if (rows.length === 0) return null;

  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || "",
    category: r.category,
    experience: r.experience_years,
    area: r.area || "",
    about: r.about || "",
    photo: r.photo_url || "",
    illustration: r.illustration || "",
    approvalStatus: r.approval_status,
    rating: r.rating === null ? null : Number(r.rating),
    reviewCount: Number(r.review_count),
  };
}

// ---------- Get my profile ----------
router.get("/me", requireAuth, requireProvider, async (req, res) => {
  try {
    const profile = await loadMyProfile(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: "Provider profile not found." });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ---------- Update my profile ----------
router.put("/me", requireAuth, requireProvider, async (req, res) => {
  const { name, phone, category, experience, area, about, photo, illustration } =
    req.body;

  if (!name?.trim() || !phone?.trim() || !area?.trim()) {
    return res
      .status(400)
      .json({ message: "Name, phone and working area are required." });
  }
  if (illustration && !ILLUSTRATIONS.includes(illustration)) {
    return res.status(400).json({ message: "Invalid illustration." });
  }
  if (photo && (!photo.startsWith("data:image/") || photo.length > 700000)) {
    return res.status(400).json({ message: "The photo is invalid or too large." });
  }

  const years = experience === "" || experience == null ? 0 : Number(experience);
  if (!Number.isInteger(years) || years < 0 || years > 60) {
    return res.status(400).json({ message: "Experience must be a whole number of years." });
  }

  const connection = await pool.getConnection();
  try {
    const [cats] = await connection.query(
      "SELECT id FROM categories WHERE name = ?",
      [category]
    );
    if (cats.length === 0) {
      return res.status(400).json({ message: "Unknown category." });
    }

    // Both updates are saved together, or not at all
    await connection.beginTransaction();

        await connection.query(
      "UPDATE users SET name = ?, phone = ?, photo_url = ? WHERE id = ?",
      [name.trim(), phone.trim(), photo || null, req.user.id]
    );

    await connection.query(
      `UPDATE provider_profiles
       SET category_id = ?, experience_years = ?, area = ?, about = ?, illustration = ?
       WHERE user_id = ?`,
      [
        cats[0].id,
        years,
        area.trim(),
        (about || "").trim() || null,
        illustration || null,
        req.user.id,
      ]
    );

    await connection.commit();

    res.json(await loadMyProfile(req.user.id));
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error." });
  } finally {
    connection.release();
  }
});

// ---------- A customer applies to become a provider ----------
router.post("/apply", requireAuth, requireRole("customer"), async (req, res) => {
  const { category, experience, area, about } = req.body;

  if (!category || !area?.trim()) {
    return res
      .status(400)
      .json({ message: "Please choose a category and enter your working area." });
  }

  const years = experience === "" || experience == null ? 0 : Number(experience);
  if (!Number.isInteger(years) || years < 0 || years > 60) {
    return res.status(400).json({ message: "Experience must be a whole number of years." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT 1 FROM provider_profiles WHERE user_id = ?",
      [req.user.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "You have already applied as a provider." });
    }

    const [cats] = await pool.query("SELECT id FROM categories WHERE name = ?", [
      category,
    ]);
    if (cats.length === 0) {
      return res.status(400).json({ message: "Unknown category." });
    }

    await pool.query(
      "INSERT INTO provider_profiles (user_id, category_id, experience_years, area, about) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, cats[0].id, years, area.trim(), (about || "").trim() || null]
    );

    res.status(201).json({ approvalStatus: "pending" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;