import express from "express";
import { sendDirectMessage, sendGroupMessage, } from "../controllers/message.controller.js";
const router = express.Router();
// gửi tin nhắn trực tiếp
router.post("/direct", sendDirectMessage);
// gửi tin nhắn nhóm
router.post("/group", sendGroupMessage);
export default router;
//# sourceMappingURL=message.route.js.map