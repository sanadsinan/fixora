import bcrypt from "bcryptjs";
import pool from "./db.js";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.log("Usage: node createAdmin.js <email> <password>");
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ('Admin', ?, ?, 'admin')",
    [email.trim().toLowerCase(), hash]
  );
  console.log("Admin created:", email);
} catch (err) {
  console.log("Could not create admin:", err.message);
}

process.exit(0);