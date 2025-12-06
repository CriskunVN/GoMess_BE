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
  if (fromUserId.toString() === toUserId) {
    throw new AppError("Không thể gửi lời mời kết bạn cho chính mình", 400);
  }

  console.log("userid:", toUserId);
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

  const request = await FriendRequest.create({
    from: fromUserId,
    to: toUserId,
    message,
  });

  return request;
};

export const acceptFriendRequestService = async (
  requestId: string,
  userId: string
) => {
  // Kiểm tra lời mời kết bạn có tồn tại không
  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    throw new AppError("Lời mời kết bạn không tồn tại", 404);
  }
  // Kiểm tra người dùng có quyền chấp nhận lời mời kết bạn không
  console.log(userId);
  if (friendRequest.to.toString() !== userId.toString()) {
    throw new AppError("Bạn không có quyền chấp nhận lời mời kết bạn này", 403);
  }

  // Tạo mối quan hệ bạn bè
  await Friend.create({
    userA: friendRequest.from,
    userB: friendRequest.to,
  });

  // Xóa lời mời kết bạn
  await FriendRequest.findByIdAndDelete(requestId);
  const data = await User.findById(friendRequest.from)
    .select("_id displayName avatarUrl")
    .lean();

  return data;
};

export const declineFriendRequestService = async (
  requestId: string,
  userId: string
) => {
  // Kiểm tra lời mời kết bạn có tồn tại không
  const friendRequest = await FriendRequest.findById(requestId);
  if (!friendRequest) {
    throw new AppError("Lời mời kết bạn không tồn tại", 404);
  }
  // Kiểm tra người dùng có quyền từ chối lời mời kết bạn không
  if (friendRequest.to.toString() !== userId.toString()) {
    throw new AppError("Bạn không có quyền từ chối lời mời kết bạn này", 403);
  }

  // Xóa lời mời kết bạn
  await FriendRequest.findByIdAndDelete(requestId);

  return { message: "Đã từ chối lời mời kết bạn" };
};

export const getFriendRequestsService = async (userId: string) => {
  const populateFields: string = "_id username displayName avatarUrl";
  // lấy danh sách lời mời kết bạn đến cho userId
  const [sent, received] = await Promise.all([
    FriendRequest.find({ from: userId }).populate("to", populateFields).lean(),
    FriendRequest.find({ to: userId }).populate("from", populateFields).lean(),
  ]);

  return { sent, received };
};

export const getAllFriendsService = async (userId: string) => {
  // lấy danh sách bạn bè của userId
  const friendShip = await Friend.find({
    $or: [{ userA: userId }, { userB: userId }],
  })
    .populate("userA userB", "_id displayName avatarUrl")
    .lean();

  if (!friendShip) {
    return [];
  }

  const friend = friendShip.map((f) =>
    String(f.userA._id) === String(userId) ? f.userB : f.userA
  );

  return friend;
};
