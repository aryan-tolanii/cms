import multer from "multer";
import path from "path";
import fs from "fs";
// export const uploadDocuments = uploadDocument.any();

import {
  TEMP_DIR,
  generateUniqueFilename,
} from "../utils/fileHelpers.js";

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },

  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file.originalname));
  },
});

const createFileFilter = (allowedMimeTypes, typeName) => {
  return (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      new Error(
        `Only ${typeName} files are allowed.`
      ),
      false
    );
  };
};

const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const videoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const documentMimeTypes = [
  "application/pdf",
];

const uploadImage = multer({
  storage,
  fileFilter: createFileFilter(
    imageMimeTypes,
    "image"
  ),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadVideo = multer({
  storage,
  fileFilter: createFileFilter(
    videoMimeTypes,
    "video"
  ),
  limits: {
    fileSize: 250 * 1024 * 1024,
  },
});

const uploadDocument = multer({
  storage,
  fileFilter: createFileFilter(
    documentMimeTypes,
    "document"
  ),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export const uploadImageSingle = (fieldName = "file") =>
  uploadImage.single(fieldName);

export const uploadVideoSingle = (fieldName = "file") =>
  uploadVideo.single(fieldName);

export const uploadDocumentSingle = (fieldName = "file") =>
  uploadDocument.single(fieldName);

export const uploadDocuments = uploadDocument.any();