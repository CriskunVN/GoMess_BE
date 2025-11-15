import type { IConversation, IUser } from "../types/type.js";
import type { Response, Request } from "express";
import catchAsync from "../utils/catchAsync.js";
import {
  createConversationService,
  getConversationsService,
  getMesssagesService,
} from "../services/conversation.service.js";

export const createConversation = catchAsync(
  async (req: Request, res: Response) => {
    const { type, name, memberIds } = req.body;
    const userId: IUser = req.user._id;

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
    const userId: IUser = req.user._id;
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
