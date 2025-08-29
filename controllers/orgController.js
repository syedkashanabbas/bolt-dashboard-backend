import pool from "../config/db.js";

// helper: insert audit log
const logAction = async (userId, action, entity, entityId, changes = null) => {
  await pool.query(
    "INSERT INTO audit_logs (user_id, action, entity, entity_id, changes) VALUES (?, ?, ?, ?, ?)",
    [userId, action, entity, entityId, JSON.stringify(changes)]
  );
};

// Get all orgs
export const getOrganizations = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM organizations ORDER BY created_at DESC");
    res.json({ success: true, organizations: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get org by ID
export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM organizations WHERE id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }
    res.json({ success: true, organization: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create org
export const createOrganization = async (req, res) => {
  try {
    const { name, domain, plan, status } = req.body;

    const [result] = await pool.query(
      "INSERT INTO organizations (name, domain, plan, status) VALUES (?, ?, ?, ?)",
      [name, domain, plan, status || "active"]
    );

    await logAction(req.user.id, "CREATE", "organization", result.insertId, { name, domain, plan, status });

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update org
export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain, plan, status } = req.body;

    await pool.query(
      "UPDATE organizations SET name = ?, domain = ?, plan = ?, status = ? WHERE id = ?",
      [name, domain, plan, status, id]
    );

    await logAction(req.user.id, "UPDATE", "organization", id, { name, domain, plan, status });

    res.json({ success: true, message: "Organization updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete org
export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM organizations WHERE id = ?", [id]);

    await logAction(req.user.id, "DELETE", "organization", id);

    res.json({ success: true, message: "Organization deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
