import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a local file to Cloudinary
 * @param {string} localFilePath - Path to the temporary file
 * @param {string} folderName - Folder structure in Cloudinary
 * @returns {Promise<object|null>} Cloudinary upload response
 */
const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });
    
    // File has been uploaded successfully, clean it up locally
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * Example: https://res.cloudinary.com/demo/image/upload/v12345/folder/item.jpg -> folder/item
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  
  // Split by /upload/
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  
  // parts[1] looks like "v12345/folder/item.jpg" or "folder/item.jpg"
  const pathParts = parts[1].split("/");
  
  // If the first part starts with "v" followed by numbers, it's a version number, skip it
  if (pathParts[0].match(/^v\d+$/)) {
    pathParts.shift();
  }
  
  // Join the remaining parts back, and remove the extension
  const pathWithExtension = pathParts.join("/");
  const publicId = pathWithExtension.split(".").slice(0, -1).join(".");
  
  return publicId;
};

/**
 * Delete a file from Cloudinary using its URL
 * @param {string} url - Secure URL of the file
 * @param {string} resourceType - "image", "video", or "raw"
 */
const deleteFromCloudinary = async (url, resourceType = "image") => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl };
