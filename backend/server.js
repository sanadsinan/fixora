import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import providerRoutes from "./routes/providers.js";
import serviceRoutes from "./routes/services.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// A simple route to check that the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Reads the categories from MySQL
app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, description FROM categories ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Public numbers for the About page
app.get("/api/stats", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM provider_profiles p
            JOIN users u ON u.id = p.user_id
            WHERE p.approval_status = 'approved' AND u.status = 'active') AS providers,
         (SELECT COUNT(*) FROM categories) AS categories,
         (SELECT COUNT(*) FROM bookings WHERE status = 'completed') AS completed,
         (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers`
    );
    const r = rows[0];
    res.json({
      providers: Number(r.providers),
      categories: Number(r.categories),
      completed: Number(r.completed),
      customers: Number(r.customers),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});