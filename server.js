// ================================
// Disaster Relief Hub - Backend
// ================================

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// ================================
// Middleware Setup
// ================================
app.use(cors({
  origin: "http://localhost:5500",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));
app.use(bodyParser.json());

// ================================
// Database Connection
// ================================
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Nayan",
  password: process.env.DB_PASS || "Iamabadman#009",
  database: process.env.DB_NAME || "reliefhub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const db = mysql.createPool(dbConfig);

// ================================
// Initialize Database + Tables
// ================================
async function initializeDatabase() {
  try {
    const conn = await db.getConnection();

    await conn.query(`CREATE DATABASE IF NOT EXISTS reliefhub`);
    await conn.query(`USE reliefhub`);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS volunteers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        state VARCHAR(100),
        city VARCHAR(100),
        skills VARCHAR(255),
        availability VARCHAR(100),
        notes TEXT,
        consent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    conn.release();
    console.log("✅ Database initialized and tables verified");
  } catch (err) {
    console.error("❌ Database initialization failed:", err.message);
  }
}
initializeDatabase();

// ================================
// Health Check Route
// ================================
app.get("/api/health", async (req, res) => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    res.json({ status: "✅ API and Database Connected", time: new Date() });
  } catch (err) {
    res.status(500).json({ status: "❌ DB Connection Error", error: err.message });
  }
});

// ================================
// Volunteer Registration
// ================================
app.post("/api/volunteer", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    state,
    city,
    skills,
    availability,
    notes,
    consent,
  } = req.body;

  console.log("📩 Received volunteer data:", req.body);

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO volunteers 
    (name, email, phone, state, city, skills, availability, notes, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [
      fullName,
      email,
      phone,
      state || "",
      city || "",
      skills || "",
      availability || "",
      notes || "",
      consent ? 1 : 0,
    ]);

    console.log(`✅ Volunteer inserted with ID: ${result.insertId}`);
    res.json({ message: "Volunteer registered successfully!" });
  } catch (err) {
    console.error("❌ Database Insert Error:", err.sqlMessage || err.message);
    res.status(500).json({
      error: "Database insert failed",
      details: err.sqlMessage || err.message,
    });
  }
});

// ================================
// Contact Form Endpoint
// ================================
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [name, email, subject, message]);
    console.log(`📩 Contact message received from ${name} (ID: ${result.insertId})`);
    res.json({ message: "Message stored successfully!" });
  } catch (err) {
    console.error("❌ Contact Insert Error:", err.sqlMessage || err.message);
    res.status(500).json({
      error: "Database insert failed",
      details: err.sqlMessage || err.message,
    });
  }
});

// ================================
// Static Files
// ================================
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================================
// 404 & Error Handlers
// ================================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
