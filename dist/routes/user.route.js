import * as userController from "../controllers/user.controller.js";
import express from "express";
import { protect, restrictTo } from "../middlewares/protectAuth.middleware.js";
const router = express.Router();
router.use(protect);
// Lấy thông tin người dùng hiện tại
router.get("/me", userController.getCurrentUser);
// Lấy thông tin người dùng theo ID
router
    .route("/:id")
    .get(userController.getUserById)
    .put(userController.updateUser)
    .patch(restrictTo("admin", "user"), userController.softDeleteUser)
    .delete(restrictTo("admin"), userController.deleteUser);
router.route("/").get(userController.getUsers); // Lấy nhiều người dùng
export default router;
//# sourceMappingURL=user.route.js.map