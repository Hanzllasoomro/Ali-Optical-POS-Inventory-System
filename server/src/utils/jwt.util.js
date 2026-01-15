import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

export const signAccessToken = (payload) => {
  return jwt.sign(payload, ENV.JWT.ACCESS_SECRET, {
    expiresIn: ENV.JWT.ACCESS_EXPIRY,
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, ENV.JWT.REFRESH_SECRET, {
    expiresIn: ENV.JWT.REFRESH_EXPIRY,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ENV.JWT.ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.JWT.REFRESH_SECRET);
};
