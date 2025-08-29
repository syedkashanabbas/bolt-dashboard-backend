// utils/auditLogger.js
import pool from "../config/db.js";

export async function logAudit({ user, table, action, recordId, changes }) {
  try {
    await pool.query(
      "INSERT INTO audit_logs (user_id, tenant_id, table_name, action, record_id, changes) VALUES (?,?,?,?,?,?)",
      [
        user.id,
        user.tenantId || null,
        table,
        action,
        recordId || null,
        JSON.stringify(changes || {})
      ]
    );
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
}
