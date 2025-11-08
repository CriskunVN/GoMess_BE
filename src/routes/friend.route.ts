import express from "express";
import * as friendController from "../controllers/friend.controller.js";

const router = express.Router();

// Lấy danh sách bạn bè
router.get("/", friendController.getAllFriends);

// Lấy danh sách lời mời kết bạn
router.get("/requests", friendController.getFriendRequest);

// Gửi lời mời kết bạn
router.post("/add", friendController.sendFriendRequest);

// Chấp nhận lời mời kết bạn
router.post(
  "/requests/:requestId/accept",
  friendController.acceptFriendRequest
);

// Từ chối lời mời kết bạn
router.post(
  "/requests/:requestId/decline",
  friendController.declineFriendRequest
);

// Xóa bạn bè
router.delete("/:id", friendController.removeFriend);

export default router;
