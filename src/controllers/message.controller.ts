import { send } from "process";
import { sendDirectMessageService } from "../services/message.service.js";
import catchAsync from "../utils/catchAsync.js";
import type { NextFunction, Request, Response } from "express";

export const sendDirectMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

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
  async (req: Request, res: Response) => {}
);
