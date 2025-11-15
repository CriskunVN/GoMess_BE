import type { IConversation, IUser } from "../types/type.js";
export declare const createConversationService: (userId: IUser, name: string, type: "direct" | "group", memberIds: string[]) => Promise<IConversation>;
export declare const getConversationsService: (userId: IUser) => Promise<{
    unreadCounts: Map<string, number>;
    participants: {
        _id: any;
        displayName: any;
        avatarUrl: any;
        joinedAt: any;
    }[];
    type: String;
    group?: typeof import("../models/conversation.model.js").groupSchema;
    lastMessageAt: Date;
    seenBy: import("mongoose").Types.ObjectId[];
    lastMessage: typeof import("../models/conversation.model.js").lastMessageSchema;
    createdAt: Date;
    updatedAt: Date;
    _id: unknown;
    $locals: Record<string, unknown>;
    $op: "save" | "validate" | "remove" | null;
    $where: Record<string, unknown>;
    baseModelName?: string;
    collection: import("mongoose").Collection;
    db: import("mongoose").Connection;
    errors?: import("mongoose").Error.ValidationError;
    id?: any;
    isNew: boolean;
    schema: import("mongoose").Schema;
    __v: number;
}[]>;
export declare const getMesssagesService: (conversationId: any, limit: number, cursor: any) => Promise<{
    messages: (import("mongoose").Document<unknown, {}, import("../types/type.js").IMessage, {}, {}> & import("../types/type.js").IMessage & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];
    nextCursor: string | null;
}>;
//# sourceMappingURL=conversation.service.d.ts.map