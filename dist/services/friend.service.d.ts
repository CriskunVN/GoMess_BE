export declare const sendFriendRequestService: (fromUserId: string, toUserId: string, message?: string) => Promise<import("mongoose").Document<unknown, {}, import("../types/type.js").IFriendRequest, {}, {}> & import("../types/type.js").IFriendRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const acceptFriendRequestService: (requestId: string, userId: string) => Promise<(import("mongoose").FlattenMaps<import("../types/type.js").IUser> & Required<{
    _id: import("mongoose").FlattenMaps<unknown>;
}> & {
    __v: number;
}) | null>;
export declare const declineFriendRequestService: (requestId: string, userId: string) => Promise<{
    message: string;
}>;
export declare const getFriendRequestsService: (userId: string) => Promise<{
    sent: (import("mongoose").FlattenMaps<import("../types/type.js").IFriendRequest> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[];
    received: (import("mongoose").FlattenMaps<import("../types/type.js").IFriendRequest> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[];
}>;
export declare const getAllFriendsService: (userId: string) => Promise<import("mongoose").Types.ObjectId[]>;
//# sourceMappingURL=friend.service.d.ts.map