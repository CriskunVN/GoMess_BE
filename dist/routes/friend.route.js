import express from "express";
import * as friendController from "../controllers/friend.controller.js";
const router = express.Router();
// Lấy danh sách bạn bè
router.get("/", friendController.getAllFriends);
router
    .route("/requests")
    .get(friendController.getFriendRequest) // Lấy danh sách lời mời kết bạn
    .post(friendController.sendFriendRequest); // Gửi lời mời kết bạn
// Chấp nhận lời mời kết bạn
router.post("/requests/:requestId/accept", friendController.acceptFriendRequest);
// Từ chối lời mời kết bạn
router.post("/requests/:requestId/decline", friendController.declineFriendRequest);
// Xóa bạn bè
router.delete("/:id", friendController.removeFriend);
export default router;
//# sourceMappingURL=friend.route.js.map