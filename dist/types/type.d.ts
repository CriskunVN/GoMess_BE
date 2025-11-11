import mongoose, { Document, Types } from "mongoose";
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
export declare const participantSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    userId: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    joinedAt: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    joinedAt: NativeDate;
}>, {}, mongoose.ResolveSchemaOptions<{
    _id: false;
}>> & mongoose.FlatRecord<{
    userId: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    joinedAt: NativeDate;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const groupSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    name: string;
    createdBy: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    avatarUrl?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    createdBy: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    avatarUrl?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<{
    _id: false;
}>> & mongoose.FlatRecord<{
    name: string;
    createdBy: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    avatarUrl?: string | null;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const lastMessageSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    content: string;
    senderId: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    _id?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    content: string;
    senderId: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    _id?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<{
    _id: false;
}>> & mongoose.FlatRecord<{
    content: string;
    senderId: {
        prototype?: Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    _id?: string | null;
}> & Required<{
    _id: string | null;
}> & {
    __v: number;
}>;
//# sourceMappingURL=type.d.ts.map