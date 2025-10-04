import type { Request, Response, NextFunction } from "express";
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const catchAsync: (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => void;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map