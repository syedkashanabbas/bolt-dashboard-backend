// routes/dashboardRoutes.js
import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import pool from "../config/db.js";

const router = express.Router();

router.get("/stats", authenticate, async (req, res) => {
  try {
    const [[userCount]] = await pool.query("SELECT COUNT(*) as totalUsers FROM users");
    const [[orgCount]] = await pool.query("SELECT COUNT(*) as organizations FROM organizations");

    res.json({
      totalUsers: userCount.totalUsers,
      organizations: orgCount.organizations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
