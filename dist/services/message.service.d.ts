import type { IConversation, IMessage } from "../types/type.js";
export declare const sendDirectMessageService: (senderId: String, recipientId: String, content: string, conversationId?: String, file?: Express.Multer.File) => Promise<IMessage>;
export declare const sendGroupMessageService: (conversationId: String, content: String, senderId: String, conversation: IConversation, file?: Express.Multer.File) => Promise<IMessage>;
//# sourceMappingURL=message.service.d.ts.map