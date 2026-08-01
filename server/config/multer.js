import multer from "multer";
import path from "path";
import { TEMP_DIR, generateUniqueFilename } from "../utils/fileHelpers.js";

/**
 * ==========================================
 * Allowed File Types
 * ==========================================
 */
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm"];
const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const ALLOWED_DOCUMENT_EXTENSIONS = [".pdf"];
const ALLOWED_DOCUMENT_MIME_TYPES = ["application/pdf"];

/**
 * ==========================================
 * Size Limits (in bytes)
 * ==========================================
 */
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
const VIDEO_SIZE_LIMIT = 200 * 1024 * 1024; // 200MB
const DOCUMENT_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB

/**
 * All uploads initially land in uploads/temp/, regardless of category.
 * They are later moved to their permanent project folder by the calling
 * code, using the fileHelpers.moveUploadedFile() helper.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file.originalname));
  },
});

/**
 * Builds a Multer fileFilter function that validates an uploaded file
 * against an allowed set of extensions and MIME types. Both are checked,
 * since MIME types reported by clients can be unreliable or spoofed, while
 * the extension alone can also be misleading — checking both together
 * gives a stronger guarantee than either check alone.
 *
 * @param {string[]} allowedExtensions - e.g. [".jpg", ".png"]
 * @param {string[]} allowedMimeTypes - e.g. ["image/jpeg", "image/png"]
 * @param {string} typeLabel - Human-readable label used in the error message
 * @returns {Function} Multer-compatible fileFilter function
 */
const buildFileFilter = (allowedExtensions, allowedMimeTypes, typeLabel) => {
  return (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const hasValidExtension = allowedExtensions.includes(extension);
    const hasValidMimeType = allowedMimeTypes.includes(file.mimetype);

    if (!hasValidExtension || !hasValidMimeType) {
      return cb(new Error(`Invalid file type. Only ${typeLabel} files are allowed.`));
    }

    cb(null, true);
  };
};

const imageFileFilter = buildFileFilter(
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  "image (jpg, jpeg, png, webp)"
);

const videoFileFilter = buildFileFilter(
  ALLOWED_VIDEO_EXTENSIONS,
  ALLOWED_VIDEO_MIME_TYPES,
  "video (mp4, mov, webm)"
);

const documentFileFilter = buildFileFilter(
  ALLOWED_DOCUMENT_EXTENSIONS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  "document (pdf)"
);

/**
 * ==========================================
 * Configured Multer Instances (one per file category)
 * ==========================================
 */
const imageUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: IMAGE_SIZE_LIMIT },
});

const videoUpload = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: VIDEO_SIZE_LIMIT },
});

const documentUpload = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: DOCUMENT_SIZE_LIMIT },
});

export {
  imageUpload,
  videoUpload,
  documentUpload,
  IMAGE_SIZE_LIMIT,
  VIDEO_SIZE_LIMIT,
  DOCUMENT_SIZE_LIMIT,
};