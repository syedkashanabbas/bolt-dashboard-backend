import pool from "../config/db.js";

// Create a tenant (only SuperAdmin)
export const createTenant = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name } = req.body;
    const [result] = await pool.query("INSERT INTO tenants (name) VALUES (?)", [
      name,
    ]);

    res.status(201).json({ success: true, tenantId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all tenants (SuperAdmin only)
export const getTenants = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [rows] = await pool.query("SELECT * FROM tenants");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
