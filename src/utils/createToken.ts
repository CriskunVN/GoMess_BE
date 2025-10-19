import jwt from "jsonwebtoken";
import crypto from "crypto";

// Hàm tạo JWT
const createTokens = (userId: string) => {
  const accessSecret = process.env.JWT_SECRET_KEY;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT secrets are not defined in environment variables.");
  }

  // Tạo access token
  const accessToken = jwt.sign(
    { id: userId },
    accessSecret as any,
    {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "30m",
    } as any
  );

  // Tạo refresh token
  const refreshToken = crypto.randomBytes(64).toString("hex");

  return { accessToken, refreshToken };
};

const createToken = (userId: string): string => {
  // Tạo access token
  return createTokens(userId).accessToken;
};

export default createToken;
export { createTokens };
