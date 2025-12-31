import type { Response, Request } from "express";
export declare const createConversation: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getConversations: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMessages: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserConversationsForSocketIO: (userId: String) => Promise<any[]>;
export declare const checkUserInConversation: (conversationId: String, userId: String) => Promise<boolean>;
export declare const markAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=conversation.controller.d.ts.map