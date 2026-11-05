import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import providerRoutes from "./routes/providers.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});