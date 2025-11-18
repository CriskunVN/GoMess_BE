import express from "express";
import { sendDirectMessage, sendGroupMessage, } from "../controllers/message.controller.js";
import { checkFriendGroup, checkFriendShip, } from "../middlewares/friend.middleware.js";
const router = express.Router();
// gửi tin nhắn trực tiếp
router.post("/direct", checkFriendShip, sendDirectMessage);
// gửi tin nhắn nhóm
router.post("/group", checkFriendGroup, sendGroupMessage);
export default router;
//# sourceMappingURL=message.route.js.map