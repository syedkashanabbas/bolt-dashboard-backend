import pool from "../config/db.js";

// GET Audit Logs
export const getAuditLogs = async (req, res) => {
  try {
    let query = `
      SELECT a.id, a.user_id, u.name as userName, a.action, a.entity, a.entity_id, a.changes, a.created_at
      FROM audit_logs a 
      JOIN users u ON a.user_id = u.id
    `;
    let params = [];

    // Filter based on role
    if (req.user.role === "Admin") {
      query += " WHERE u.tenant_id = ?";
      params.push(req.user.tenantId);
    } else if (req.user.role === "User") {
      query += " WHERE u.id = ?";
      params.push(req.user.id);
    }

    query += " ORDER BY a.created_at DESC";

    const [rows] = await pool.query(query, params);

    res.json({ success: true, logs: rows });
  } catch (err) {
    console.error("GetAuditLogs Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
