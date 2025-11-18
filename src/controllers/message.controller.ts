import {
  sendDirectMessageService,
  sendGroupMessageService,
} from "../services/message.service.js";
import catchAsync from "../utils/catchAsync.js";
import type { NextFunction, Request, Response } from "express";
import type { IConversation } from "../types/type.js";

export const sendDirectMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { recipientId, content, conversationId } = req.body;
    const senderId: String = req.user?.id as String;

    const message = await sendDirectMessageService(
      senderId,
      recipientId,
      content,
      conversationId
    );

    res.status(201).json({ message });
  }
);

export const sendGroupMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { conversationId, content } = req.body;
    const senderId: string = req.user?._id as string;

    const conversation: IConversation = req.conversation;

    const message = await sendGroupMessageService(
      conversationId,
      content,
      senderId,
      conversation
    );

    res.status(201).json({ message });
  }
);
