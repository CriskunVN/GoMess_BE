import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";
import Friend from "../models/friend.model.js";
import AppError from "../utils/AppError.js";

// service gửi lời mời kết bạn
export const sendFriendRequestService = async (
  fromUserId: string,
  toUserId: string,
  message?: string
) => {
  // kiểm tra user gửi lời mời kết bạn có trùng với user nhận lời mời kết bạn không
  if (fromUserId === toUserId) {
    throw new AppError("Không thể gửi lời mời kết bạn cho chính mình", 400);
  }

  // kiểm tra user nhận lời mời kết bạn có tồn tại không
  const userExists = await User.exists({ _id: toUserId });
  if (!userExists) {
    throw new AppError("Người dùng không tồn tại", 404);
  }

  // kiểm tra đã là bạn bè chưa
  let [userA, userB] = [fromUserId.toString(), toUserId.toString()];
  if (userA > userB) {
    [userA, userB] = [userB, userA];
  }

  const [alreadyFriend, existingRequest] = await Promise.all([
    Friend.findOne({ userA, userB }),
    FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId },
      ],
    }),
  ]);

  if (alreadyFriend) {
    throw new AppError("Đã là bạn bè", 400);
  }

  if (existingRequest) {
    throw new AppError(
      "Đã có lời mời kết bạn tồn tại giữa hai người dùng",
      400
    );
  }
};
