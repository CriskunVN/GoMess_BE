import mongoose, { Document, Types } from "mongoose";

// type message
export interface IMessage extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  content: string;
  imgUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// type session
export interface ISession extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// type user
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

// type conversation
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

export const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

export const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Ảnh đại diện nhóm
    avatarUrl: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

export const lastMessageSchema = new mongoose.Schema(
  {
    _id: { type: String },
    content: { type: String, default: null },
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
      createdAt: {
        type: Date,
        default: null,
      },
    },
  },
  { _id: false }
);
