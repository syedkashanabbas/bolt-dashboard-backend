import express from "express";
import { seedSuperAdmin, seedTenantWithAdmin } from "../controllers/seederController.js";

const router = express.Router();

router.post("/superadmin", seedSuperAdmin);
router.post("/tenant-admin", seedTenantWithAdmin);

export default router;
