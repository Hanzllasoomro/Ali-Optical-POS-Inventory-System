import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  MONGO_URI: process.env.MONGO_URI,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },
};
