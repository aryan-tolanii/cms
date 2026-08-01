import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads", "temp-floorplans");

    fs.mkdirSync(uploadDir, { recursive: true });

    console.log("Upload directory:", uploadDir);

    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    console.log("Incoming file:", file.originalname);

    const ext = path.extname(file.originalname);

    cb(null, `${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File received by Multer:");
  console.log({
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed."));
  }

  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
