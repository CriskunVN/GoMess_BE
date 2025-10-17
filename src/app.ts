import express from "express";
import type { Request, Response, NextFunction, Application } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/auth.route.js";
import UserRoute from "./routes/user.route.js";
const app: Application = express();

//1. Middleware
app.use(cors());
app.use(morgan("dev")); // Ghi log các request
app.use(cookieParser());
app.use(express.json());

//2. Routes
const apiPrefix = process.env.API_PREFIX || "/api/v1";

app.use(`${apiPrefix}/auth`, AuthRoute);
app.use(`${apiPrefix}/users`, UserRoute);
// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
