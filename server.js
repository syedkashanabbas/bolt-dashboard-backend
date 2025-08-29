import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// test DB connection
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS result");
    console.log("✅ DB Connected. Test Result:", rows[0].result);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
})();

// test route
app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    res.json({ message: "API is working!", time: rows[0].currentTime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
