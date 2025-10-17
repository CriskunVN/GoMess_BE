import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust the type based on your user model (e.g., { _id: string; email: string; } or a User interface)
    }
  }
}
