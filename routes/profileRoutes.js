import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);

export default router;
