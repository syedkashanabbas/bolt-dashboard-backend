import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, tenantId: user.tenant_id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, tenantId: user.tenant_id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER (normal flow, SuperAdmin will add tenants later)
export const register = async (req, res) => {
  try {
    const { name, email, password, tenant_id, role } = req.body;

    // Check if user already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, tenant_id, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, tenant_id || null, role || "User"]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // store refreshToken in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return token + user info
    res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.tenant_id,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// REFRESH TOKEN
export const refresh = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    res.json({ success: true, accessToken: newAccessToken });
  });
};

// LOGOUT (clear cookie)
export const logout = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.json({ success: true, message: "Logged out successfully" });
};
