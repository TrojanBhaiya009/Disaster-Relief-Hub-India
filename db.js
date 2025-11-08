import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Trying to connect with:");
console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Connection error details:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

export default db;
