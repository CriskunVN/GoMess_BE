import { Request } from "express";
import type { IUser } from "./type.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      conversation?: IConversation;
    }
  }
}
