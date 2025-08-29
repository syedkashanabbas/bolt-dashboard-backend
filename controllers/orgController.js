import pool from "../config/db.js";

// Get all organizations
export const getOrganizations = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM organizations");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single organization
export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM organizations WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Organization not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create organization
export const createOrganization = async (req, res) => {
  try {
    const { name, domain, plan, status } = req.body;

    const [result] = await pool.query(
      "INSERT INTO organizations (name, domain, plan, status) VALUES (?, ?, ?, ?)",
      [name, domain, plan, status || "active"]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update organization
export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain, plan, status } = req.body;

    await pool.query(
      "UPDATE organizations SET name = ?, domain = ?, plan = ?, status = ? WHERE id = ?",
      [name, domain, plan, status, id]
    );

    res.json({ success: true, message: "Organization updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete organization
export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM organizations WHERE id = ?", [id]);
    res.json({ success: true, message: "Organization deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
