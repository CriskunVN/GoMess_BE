import mongoose, { Document, Types } from "mongoose";
import type { groupSchema, lastMessageSchema, participantSchema } from "../models/conversation.model.js";
export interface IMessage extends Document {
    conversationId: mongoose.Schema.Types.ObjectId;
    senderId: mongoose.Schema.Types.ObjectId;
    content: string;
    imgUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISession extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUser extends Document {
    username: string;
    email: string;
    phoneNumber?: string;
    password: string;
    displayName: string;
    avatarUrl?: string;
    avatarID?: string;
    bio?: string;
    onlineAt?: Date;
    isActive: boolean;
    role: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IConversation extends Document {
    type: String;
    participants: [typeof participantSchema];
    group?: typeof groupSchema;
    lastMessageAt: Date;
    seenBy: Types.ObjectId[];
    lastMessage: typeof lastMessageSchema;
    unreadCounts: Map<string, number>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IFriend extends Document {
    userA: Types.ObjectId;
    userB: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export interface IFriendRequest extends Document {
    from: Types.ObjectId;
    to: Types.ObjectId;
    message?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=type.d.ts.map