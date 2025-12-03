import type { IConversation } from "../types/type.js";
import type { Response, Request } from "express";
import catchAsync from "../utils/catchAsync.js";
import {
  createConversationService,
  getConversationsService,
  getMesssagesService,
} from "../services/conversation.service.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = catchAsync(
  async (req: Request, res: Response) => {
    const { type, name, memberIds } = req.body;
    const userId: String = req.user?._id as String;

    const conversation: IConversation = await createConversationService(
      userId,
      name,
      type,
      memberIds
    );
    res
      .status(201)
      .json({ message: "Tạo cuộc trò chuyện thành công", conversation });
  }
);

export const getConversations = catchAsync(
  async (req: Request, res: Response) => {
    const userId: String = req.user?._id as String;
    const data = await getConversationsService(userId);
    res
      .status(200)
      .json({ message: "Lấy danh sách cuộc trò chuyện thành công", data });
  }
);

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const { limit = 50, cursor } = req.query;

  const { messages, nextCursor } = await getMesssagesService(
    conversationId,
    Number(limit),
    cursor
  );

  res.status(200).json({ messages, nextCursor });
});

export const getUserConversationsForSocketIO = async (userId: String) => {
  try {
    const conversations: IConversation[] = await Conversation.find(
      { "participants.userId": userId },
      {
        _id: 1,
      }
    );
    return conversations.map((conv: any) => conv._id.toString());
  } catch (error) {
    console.error("Lỗi lấy cuộc trò chuyện cho Socket.IO:", error);
    return [];
  }
};
