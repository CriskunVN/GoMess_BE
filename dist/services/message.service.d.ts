import type { IConversation, IMessage } from "../types/type.js";
export declare const sendDirectMessageService: (senderId: String, recipientId: String, content: string, conversationId?: String) => Promise<IMessage>;
export declare const sendGroupMessageService: (conversationId: String, content: String, senderId: String, conversation: IConversation) => Promise<IMessage>;
//# sourceMappingURL=message.service.d.ts.map