import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Seed a SuperAdmin
export const seedSuperAdmin = async (req, res) => {
  try {
    const email = "super@admin.com";
    const password = await bcrypt.hash("supersecret", 10);

    // check if exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.json({ success: true, message: "SuperAdmin already exists" });
    }

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Super Admin", email, password, "SuperAdmin"]
    );

    res.json({ success: true, message: "SuperAdmin seeded", email, password: "supersecret" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Seed a demo Tenant + Admin
export const seedTenantWithAdmin = async (req, res) => {
  try {
    const tenantName = "Demo Company";
    const adminEmail = "admin@demo.com";
    const adminPassword = await bcrypt.hash("admin123", 10);

    // create tenant
    const [tenant] = await pool.query("INSERT INTO tenants (name) VALUES (?)", [tenantName]);
    const tenantId = tenant.insertId;

    // create admin for that tenant
    await pool.query(
      "INSERT INTO users (name, email, password, role, tenant_id) VALUES (?, ?, ?, ?, ?)",
      ["Demo Admin", adminEmail, adminPassword, "Admin", tenantId]
    );

    res.json({
      success: true,
      message: "Demo tenant + admin seeded",
      tenant: { id: tenantId, name: tenantName },
      admin: { email: adminEmail, password: "admin123" },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
