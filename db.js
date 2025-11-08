// ================================
// Database Connection Module
// ================================
// NOTE: Database connection is now handled directly in server.js
// using mysql2/promise connection pool.
// This file is kept for reference only.

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// Connection pool configuration used in server.js
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Nayan",
  password: process.env.DB_PASS || "Iamabadman#009",
  database: process.env.DB_NAME || "reliefhub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

module.exports = dbConfig;
