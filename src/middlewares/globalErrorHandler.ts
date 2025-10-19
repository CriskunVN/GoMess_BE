import type { ErrorRequestHandler } from "express";

// Centralized error handling middleware
// - Knows how to format AppError (operational) vs programming errors
// - Shows stack/details in development, minimal info in production
const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  _req,
  res,
  _next
) => {
  const statusCode: number =
    typeof err?.statusCode === "number" ? err.statusCode : 500;
  const status: string = typeof err?.status === "string" ? err.status : "error";
  const message: string =
    typeof err?.message === "string" && err.message.length > 0
      ? err.message
      : "Internal Server Error";

  const isDev = process.env.NODE_ENV === "development";
  const isOperational = Boolean(err?.isOperational);

  if (isDev) {
    // In dev, return as much info as possible to speed up debugging
    return res.status(statusCode).json({
      status,
      message,
      error: err,
      stack: err?.stack,
    });
  }

  // In production: only leak details for operational errors
  if (isOperational) {
    return res.status(statusCode).json({ status, message });
  }

  // Unknown/Programming error: do not leak internals
  return res
    .status(500)
    .json({ status: "error", message: "Something went wrong" });
};

export default globalErrorHandler;
