import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { logAudit } from "../utils/auditLogger.js";

// GET logged-in user's profile
export const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, tenant_id as organizationId FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE profile (with audit logging)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    // fetch old user
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const oldValues = { name: user.name, email: user.email };

    // verify current password if new password is requested
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    // build update query
    let query = "UPDATE users SET name = ?, email = ?";
    let params = [name, email];

    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      query += ", password = ?";
      params.push(hashed);
    }

    query += " WHERE id = ?";
    params.push(req.user.id);

    await pool.query(query, params);

    // fetch updated user
    const [updatedRows] = await pool.query(
      "SELECT id, name, email, role, tenant_id as organizationId FROM users WHERE id = ?",
      [req.user.id]
    );
    const updatedUser = updatedRows[0];

    // log audit
    await logAudit(
      req.user.id,
      "UPDATE_PROFILE",
      "users",
      req.user.id,
      oldValues,
      { name: updatedUser.name, email: updatedUser.email }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
