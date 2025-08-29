import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate); // all user routes need login

router.get("/", getUsers); // list staff
router.post("/", createUser); // create staff
router.put("/:id", updateUser); // update staff
router.delete("/:id", deleteUser); // delete staff
router.get("/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, tenant_id as organizationId FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
