import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

function configure() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw ApiError.badRequest("Cloudinary is not configured on the server");
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export const mediaService = {
  async uploadImage(file) {
    if (!file) throw ApiError.badRequest("Image file is required");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      throw ApiError.badRequest("Only JPG, PNG, and WEBP images are supported");
    }
    if (file.size > 8 * 1024 * 1024) {
      throw ApiError.badRequest("Image must be smaller than 8 MB");
    }
    configure();
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "royal-palace-hotel/content", resource_type: "image" },
        (error, result) => {
          if (error) return reject(new Error("Cloudinary upload failed"));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      upload.end(file.buffer);
    });
  },
};
