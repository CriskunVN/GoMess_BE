import { sendFriendRequestService, acceptFriendRequestService, declineFriendRequestService, getFriendRequestsService, getAllFriendsService, } from "../services/friend.service.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
// Lấy danh sách bạn bè
export const getAllFriends = catchAsync(async (req, res) => {
    const userId = req.user._id; // user hiện tại đang xác thực
    const friends = await getAllFriendsService(userId);
    res.status(200).json({ message: "Lấy danh sách bạn bè", friends });
});
// Gửi lời mời kết bạn
export const sendFriendRequest = catchAsync(async (req, res) => {
    const { to, message } = req.body;
    const from = req.user._id; // user hiện tại đang xác thực
    // Gọi service để gửi lời mời kết bạn
    const friendRequest = await sendFriendRequestService(from, to, message);
    res
        .status(200)
        .json({ message: "Gửi lời mời kết bạn thành công", friendRequest });
});
// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = catchAsync(async (req, res, next) => {
    const { requestId } = req.params;
    // Kiểm tra requestId có tồn tại không
    if (!requestId) {
        next(new AppError("Thiếu requestId", 400));
        return;
    }
    const user = req.user._id; // user hiện tại đang xác thực
    const data = await acceptFriendRequestService(requestId, user);
    res.status(200).json({
        message: "Chấp nhận lời mời kết bạn",
        newFriend: {
            _id: data?._id,
            displayName: data?.displayName,
            avatarUrl: data?.avatarUrl,
        },
    });
});
// Từ chối lời mời kết bạn
export const declineFriendRequest = catchAsync(async (req, res) => {
    const { requestId } = req.params;
    // Kiểm tra requestId có tồn tại không
    if (!requestId) {
        throw new AppError("Thiếu requestId", 400);
    }
    const user = req.user._id; // user hiện tại đang xác thực
    const { message } = await declineFriendRequestService(requestId, user);
    // Trả về phản hồi
    res.status(204).json({ message: message });
});
// Lấy danh sách lời mời kết bạn
export const getFriendRequest = catchAsync(async (req, res) => {
    const userId = req.user._id; // user hiện tại đang xác thực
    const { sent, received } = await getFriendRequestsService(userId);
    res.status(200).json({
        message: "Lấy danh sách lời mời kết bạn",
        sent,
        received,
    });
});
// Xóa bạn bè
export const removeFriend = catchAsync(async (req, res) => {
    res.status(200).json({ message: "Xóa bạn bè" });
});
//# sourceMappingURL=friend.controller.js.map