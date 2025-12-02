import Conversation from "../models/conversation.model.js";
import type { Request, Response, NextFunction } from "express";
import Friend from "../models/friend.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import type { IFriend } from "../types/type.js";

const pair = (a: string, b: string) => {
  return a < b ? [a, b] : [b, a];
};

export const checkFriendShip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const me: string = req.user?._id as string;

    const recipientId: string = req.body?.recipientId ?? null;
    const memberIds: string[] = req.body?.memberIds ?? null;

    if (!recipientId && memberIds.length === 0) {
      throw new AppError("Thiếu recipientId", 400);
    }
    // trường hợp chat 1-1
    if (recipientId) {
      const [userA, userB] = pair(me, recipientId);
      const isFriendShip: IFriend =
        ((await Friend.findOne({ userA, userB })) as IFriend) || null;
      if (!isFriendShip) {
        throw new AppError("Chỉ có thể gửi tin nhắn cho bạn bè", 403);
      }
      // Đảm bảo chỉ gọi next() một lần cho nhánh 1-1
      return next();
    }

    // Todo: chat nhóm
    // kiểm tra tất cả memberIds có phải là bạn bè với mình không
    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me.toString(), memberId);
      const friendShip: IFriend = (await Friend.findOne({
        userA,
        userB,
      })) as IFriend;
      // nếu là bạn bè trả về null , nếu không phải bạn bè trả về memberId
      return friendShip ? null : memberId;
    });

    // chờ tất cả các kiểm tra hoàn thành
    const results: string[] = (await Promise.all(friendChecks)) as string[];
    // lọc ra những người không phải là bạn bè , loại bỏ giá trị null
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      throw new AppError(
        `Chỉ có thể thêm bạn bè vào cuộc trò chuyện nhóm. Người dùng sau không phải là bạn bè: ${notFriends.join(
          ", "
        )}`,
        403
      );
    }
    return next();
  }
);

export const checkFriendGroup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const senderId: String = req.user?._id as String;
    const { conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      throw new AppError("Bạn không tìm thấy cuộc trò chuyện", 404);
    }

    const isCheck = await conversation?.participants.some(
      (p: any) => p.userId.toString() === senderId
    );

    if (!isCheck) {
      throw new AppError("Bạn không phải thành viên cuộc trò chuyện này", 403);
    }

    req.conversation = conversation;

    return next();
  }
);
