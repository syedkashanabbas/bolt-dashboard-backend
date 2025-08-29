import express from "express";
import { register, login, refresh } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    await register(req, res);
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    await login(req, res);
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/refresh", async (req, res) => {
  try {
    await refresh(req, res);
  } catch (err) {
    console.error("Refresh Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
