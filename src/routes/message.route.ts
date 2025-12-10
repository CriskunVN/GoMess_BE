import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../controllers/message.controller.js";
import {
  checkFriendGroup,
  checkFriendShip,
} from "../middlewares/friend.middleware.js";
import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "../middlewares/upload.middleware.js";

const router = express.Router();

// gửi tin nhắn trực tiếp (có thể có file hoặc không)
router.post("/direct", uploadSingleFile, checkFriendShip, sendDirectMessage);

// gửi tin nhắn nhóm (có thể có file hoặc không)
router.post("/group", uploadSingleFile, checkFriendGroup, sendGroupMessage);

export default router;
