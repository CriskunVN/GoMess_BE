import express from "express";
import { createConversation, getConversations, getMessages, markAsRead, } from "../controllers/conversation.controller.js";
import { checkFriendShip } from "../middlewares/friend.middleware.js";
const router = express.Router();
router.post("/", checkFriendShip, createConversation);
router.get("/", getConversations);
router.get("/:conversationId/messages", getMessages);
router.put("/:conversationId/read", markAsRead);
export default router;
//# sourceMappingURL=conversation.route.js.map