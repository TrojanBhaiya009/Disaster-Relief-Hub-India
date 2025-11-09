// ================================
// 🚀 Disaster Relief Hub Backend (Dual Mode: Local + Vercel)
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
// 🧩 MIDDLEWARE
// ================================
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: ["http://localhost:5500", "https://hack-ops-repo-lkbq.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ================================
// 💾 DATABASE CONFIG (Auto Switch)
// ================================
const isVercel = process.env.VERCEL === "1";

const dbConfig = isVercel
  ? {
      host: process.env.DB_HOST || "sql.freedb.tech",
      user: process.env.DB_USER || "freedb_nayan",
      password: process.env.DB_PASS || "password123",
      database: process.env.DB_NAME || "freedb_reliefhub",
    }
  : {
      host: "localhost",
      user: "root", // ya "Nayan" if your local user is that
      password: "Iamabadman#009",
      database: "reliefhub",
    };

let db;

async function initDB() {
  try {
    db = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
}
initDB();

// ================================
// 🩺 HEALTH CHECK
// ================================
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS time");
    res.json({ status: "✅ API & DB Connected", time: rows[0].time });
  } catch (err) {
    res.status(500).json({ status: "❌ DB Error", error: err.message });
  }
});

// ================================
// 👥 VOLUNTEER REGISTRATION
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
    res.json({ message: "✅ Volunteer registered successfully!", id: result.insertId });
  } catch (err) {
    res.status(500).json({
      error: "Database insert failed",
      details: err.sqlMessage || err.message,
    });
  }
});

// ================================
// 💬 CONTACT FORM
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
    res.json({ message: "✅ Message stored successfully!", id: result.insertId });
  } catch (err) {
    res.status(500).json({
      error: "Database insert failed",
      details: err.sqlMessage || err.message,
    });
  }
});

// ================================
// 🌐 FRONTEND ROUTES
// ================================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get(["/volunteer", "/volunteers"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "volunteers.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================================
// 🚀 SERVER START
// ================================
const PORT = process.env.PORT || 5500;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`💻 Local Server running on http://localhost:${PORT}`));
}

module.exports = app;
