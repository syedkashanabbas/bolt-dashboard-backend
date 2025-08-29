import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import pool from "./config/db.js";

// routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import seederRoutes from "./routes/seederRoutes.js";

dotenv.config();
const app = express();

// middlewares
app.use(express.json());

// ✅ Proper CORS setup
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,              // allow cookies/headers
  })
);

app.use(morgan("dev"));
app.use(cookieParser());

// test DB connection at startup
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1+1 AS result");
    console.log("✅ DB Connected. Test Result:", rows[0].result);
  } catch (err) {
    console.error("DB Connection Failed:", err.message);
  }
})();

// base route
app.get("/", (req, res) => {
  res.send("🚀 SaaS API is running");
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/seed", seederRoutes);

// catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
