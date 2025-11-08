// ================================
// Disaster Relief Hub - Backend
// ================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ================================
// Database Connection
// ================================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Nayan",
  password: process.env.DB_PASS || "Iamabadman#009",
  database: process.env.DB_NAME || "reliefhub",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ================================
// Root
// ================================
app.get("/", (req, res) => {
  res.send("🌍 Disaster Relief Hub API is running");
});

// ================================
// Volunteer Registration Endpoint
// ================================
app.post("/api/volunteers", (req, res) => {
  const { name, expertise, location, availability, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO volunteers (name, expertise, location, availability, email, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [name, expertise, location, availability, email, phone], (err) => {
    if (err) {
      console.error("Error inserting volunteer:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.json({ message: "Volunteer registered successfully!" });
  });
});

// ================================
// Contact Form Endpoint
// ================================
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [name, email, subject, message], (err) => {
    if (err) {
      console.error("Error inserting contact message:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.json({ message: "Message received successfully!" });
  });
});

// ================================
// Server Start
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  const query = "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, subject, message], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).send("Database error");
    }
    res.send("Message saved successfully");
  });
});
