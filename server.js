// ================================
// Disaster Relief Hub - Unified Backend for Vercel
// ================================

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ================================
// Database
// ================================
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Nayan",
  password: process.env.DB_PASS || "Iamabadman#009",
  database: process.env.DB_NAME || "reliefhub",
  waitForConnections: true,
  connectionLimit: 10,
});

// ================================
// Health Check
// ================================
app.get("/api/health", async (req, res) => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    res.json({ status: "✅ API and Database Connected", time: new Date() });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed", details: err.message });
  }
});

// ================================
// Volunteer Registration
// ================================
app.post("/api/volunteer", async (req, res) => {
  const { fullName, email, phone, state, city, skills, availability, notes, consent } = req.body;

  if (!fullName || !email || !phone)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    await db.query(
      `INSERT INTO volunteers (name, email, phone, state, city, skills, availability, notes, consent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, phone, state, city, skills, availability, notes, consent ? 1 : 0]
    );
    res.json({ message: "Volunteer registered successfully!" });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: "Database insert failed", details: err.message });
  }
});

// ================================
// Contact Form
// ================================
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    await db.query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
      [name, email, subject, message]
    );
    res.json({ message: "Message stored successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database insert failed", details: err.message });
  }
});

// ================================
// Serve Frontend (For Vercel)
// ================================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================================
// Start Server (Local Dev only)
// ================================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => console.log(`🚀 Local server on http://localhost:${PORT}`));
}

// Export for Vercel
module.exports = app;
