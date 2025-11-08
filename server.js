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
app.use(cors());
app.use(bodyParser.json());
// NOTE: express.static() has been moved down!

// ================================
// Database Connection
// ================================
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Nayan",
  password: process.env.DB_PASS || "Iamabadman#009",
  database: process.env.DB_NAME || "reliefhub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 30000,
});

// Test connection
db.getConnection().then(conn => {
  console.log("✅ Connected to MySQL Database");
  conn.release();
}).catch(err => {
  console.error("❌ Database Connection Error:", err.message);
});

// ================================
// API ROUTES (MOVED UP)
// ================================
// These MUST come before app.use(express.static(...))

// ===== HEALTH CHECK ENDPOINT =====
app.get("/api/health", async (req, res) => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    res.json({ status: "✅ Server and Database are OK", timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: "❌ Database Connection Failed", error: err.message });
  }
});

// ===== CREATE TABLES IF NOT EXIST =====
async function initializeDatabase() {
  try {
    const conn = await db.getConnection();
    
    // Create volunteers table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS volunteers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        state VARCHAR(100),
        city VARCHAR(100),
        skills VARCHAR(255),
        availability VARCHAR(100),
        notes TEXT,
        consent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create contact_messages table
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
    
    console.log("✅ Database tables initialized");
    conn.release();
  } catch (err) {
    console.error("❌ Error initializing database:", err.message);
  }
}

// Initialize on startup
initializeDatabase();

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

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO volunteers 
    (name, email, phone, state, city, skills, availability, notes, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [
      fullName,
      email,
      phone,
      state,
      city,
      skills,
      availability,
      notes,
      consent ? 1 : 0,
    ]);
    console.log(`✅ Volunteer registered: ${fullName}`);
    res.json({ message: "Volunteer registered successfully!" });
  } catch (err) {
    console.error("❌ Error inserting volunteer:", err);
    res.status(500).json({ error: "Database insert failed", details: err.message });
  }
});

// ================================
// Contact Form Endpoint (MOVED UP)
// ================================
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;
  try {
    await db.query(query, [name, email, subject, message]);
    console.log(`📩 Contact form submitted by: ${name}`);
    res.json({ message: "Message received successfully!" });
  } catch (err) {
    console.error("❌ Error inserting contact message:", err);
    res.status(500).json({ error: "Database insert failed", details: err.message });
  }
});

// ================================
// STATIC FILES & ROOT ROUTE (MOVED LAST)
// ================================
app.use(express.static(path.join(__dirname, "public"))); // serve HTML/CSS/JS

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ================================
// Server Start
// ================================
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});