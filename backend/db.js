import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// A pool keeps several database connections ready to use
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;