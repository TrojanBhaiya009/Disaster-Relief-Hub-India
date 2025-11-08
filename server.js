import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// POST: Register Volunteer
app.post("/api/volunteers", (req, res) => {
  const { fullName, email, phone, state, city, skills, availability, notes, consent } = req.body;

  if (!fullName || !email || !phone || !state || !city || !skills || !availability) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO volunteers 
    (full_name, email, phone, state, city, skills, availability, notes, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullName, email, phone, state, city, skills, availability, notes, consent ? 1 : 0], (err, result) => {
    if (err) {
      console.error("❌ Insert Error:", err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.status(201).json({ message: "Volunteer registered successfully", id: result.insertId });
  });
});

// GET: View all volunteers
app.get("/api/volunteers", (req, res) => {
  db.query("SELECT * FROM volunteers ORDER BY registered_at DESC", (err, rows) => {
    if (err) return res.status(500).json({ message: "DB fetch error" });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
