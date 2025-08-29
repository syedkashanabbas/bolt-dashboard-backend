import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Get all staff for a tenant
export const getUsers = async (req, res) => {
  try {
    const { tenantId, role } = req.user;

    // SuperAdmin can see all
    let query = "SELECT id, name, email, role, tenant_id FROM users";
    let params = [];

    if (role !== "SuperAdmin") {
      query += " WHERE tenant_id = ?";
      params.push(tenantId);
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create staff user (Admin inside a tenant can do this)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { tenantId } = req.user;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role, tenant_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role || "User", tenantId]
    );

    res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update staff user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;
    const { tenantId, role: userRole } = req.user;

    let query = "UPDATE users SET name = ?, role = ? WHERE id = ?";
    let params = [name, role, id];

    // Restrict to tenant unless SuperAdmin
    if (userRole !== "SuperAdmin") {
      query += " AND tenant_id = ?";
      params.push(tenantId);
    }

    await pool.query(query, params);
    res.json({ success: true, message: "User updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete staff user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, role } = req.user;

    let query = "DELETE FROM users WHERE id = ?";
    let params = [id];

    if (role !== "SuperAdmin") {
      query += " AND tenant_id = ?";
      params.push(tenantId);
    }

    await pool.query(query, params);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
