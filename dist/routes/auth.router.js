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
router.get("/me", protect, authController.getCurrentUser);
export default router;
//# sourceMappingURL=auth.router.js.map