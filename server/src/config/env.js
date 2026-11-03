import dotenv from "dotenv";
dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 5000,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    CURRENCY: process.env.CURRENCY || "ETB",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};