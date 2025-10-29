import * as authController from "../controllers/auth.controller.js";
import express from "express";
import { protect } from "../middlewares/protectAuth.middleware.js";
const router = express.Router();
// Đăng ký người dùng mới
router.post("/register", authController.Register);
// Đăng nhập người dùng
router.post("/login", authController.Login);
// Đăng xuất người dùng
router.post("/logout", protect, authController.Logout);
router.post("/refresh", authController.refreshToken);
router.get("/test", authController.test);
export default router;
//# sourceMappingURL=auth.route.js.map