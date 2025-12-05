import * as userController from "../controllers/user.controller.js";
import express from "express";
import { protect, restrictTo } from "../middlewares/protectAuth.middleware.js";
const router = express.Router();

// Lấy thông tin người dùng hiện tại
router.get("/me", userController.getCurrentUser);

// search user
router.route("/search").get(userController.searchUsers); // Tìm kiếm người dùng

// Lấy thông tin người dùng theo ID
router
  .route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUser)
  .patch(restrictTo("admin", "user"), userController.softDeleteUser)
  .delete(restrictTo("admin"), userController.deleteUser);

router.route("/").get(userController.getUsers); // Lấy nhiều người dùng

export default router;
