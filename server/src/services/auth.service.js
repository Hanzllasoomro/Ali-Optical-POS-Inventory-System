import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.model.js";
import {
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt.util.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/password.util.js";
import {
  findUserByEmail,
  createUser,
} from "../repository/user.repository.js";

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const passwordHash = await hashPassword(password);

  return createUser({ name, email, passwordHash, role });
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user || !user.isActive)
    throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");

  const payload = { sub: user._id, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { user, accessToken, refreshToken };
};
