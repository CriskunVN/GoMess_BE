import type { IConversation, IUser } from "../types/type.js";
import type { Response, Request } from "express";
import catchAsync from "../utils/catchAsync.js";
import { createConversationService } from "../services/conversation.service.js";

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
  async (req: Request, res: Response) => {}
);

export const getMessages = catchAsync(
  async (req: Request, res: Response) => {}
);
