import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { getAuditLogs } from "../controllers/auditController.js";

const router = express.Router();

// fetch audit logs
router.get("/", authenticate, getAuditLogs);

export default router;