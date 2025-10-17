import * as authController from "../controllers/auth.controller.js";
import express from "express";
import { protect } from "../middlewares/protectAuth.middleware.js";
const router = express.Router();

// Đăng ký người dùng mới
router.post("/register", authController.Register);

// Đăng nhập người dùng
router.post("/login", authController.Login);

// Refresh token
router.post("/refresh", protect, authController.refreshToken);

// Lấy thông tin người dùng hiện tại
router.get("/me", protect, authController.getCurrentUser);
export default router;
