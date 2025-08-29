import pool from "../config/db.js";
import { logAudit } from "../utils/auditLogger.js";

// CREATE Tenant (SuperAdmin only)
export const createTenant = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Tenant name is required" });
    }

    const [result] = await pool.query("INSERT INTO tenants (name) VALUES (?)", [name]);

    await logAudit({
      user: req.user,
      table: "tenants",
      action: "CREATE",
      recordId: result.insertId,
      changes: { new: { name } }
    });

    res.status(201).json({
      success: true,
      message: "Tenant created",
      tenantId: result.insertId,
    });
  } catch (err) {
    console.error("CreateTenant Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all Tenants (SuperAdmin only)
export const getTenants = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const [rows] = await pool.query("SELECT id, name, created_at FROM tenants ORDER BY created_at DESC");

    res.json({ success: true, tenants: rows });
  } catch (err) {
    console.error("GetTenants Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET a single Tenant by ID (SuperAdmin only)
export const getTenantById = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const [rows] = await pool.query("SELECT id, name, created_at FROM tenants WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    res.json({ success: true, tenant: rows[0] });
  } catch (err) {
    console.error("GetTenantById Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Tenant (SuperAdmin only)
export const updateTenant = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const { name } = req.body;

    const [oldData] = await pool.query("SELECT * FROM tenants WHERE id = ?", [id]);

    await pool.query("UPDATE tenants SET name = ? WHERE id = ?", [name, id]);

    await logAudit({
      user: req.user,
      table: "tenants",
      action: "UPDATE",
      recordId: id,
      changes: { old: oldData[0], new: { name } }
    });

    res.json({ success: true, message: "Tenant updated" });
  } catch (err) {
    console.error("UpdateTenant Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE Tenant (SuperAdmin only)
export const deleteTenant = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const [oldData] = await pool.query("SELECT * FROM tenants WHERE id = ?", [id]);

    await pool.query("DELETE FROM tenants WHERE id = ?", [id]);

    await logAudit({
      user: req.user,
      table: "tenants",
      action: "DELETE",
      recordId: id,
      changes: { old: oldData[0] }
    });

    res.json({ success: true, message: "Tenant deleted" });
  } catch (err) {
    console.error("DeleteTenant Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
