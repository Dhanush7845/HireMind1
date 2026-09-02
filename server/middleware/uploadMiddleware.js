
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// --------------------------------------------------
// Temporary upload directory
// --------------------------------------------------

// Use the operating system temporary directory.
// This is more suitable for serverless environments
// than storing uploaded files permanently inside
// the project directory.

const uploadDir = path.join(os.tmpdir(), "hiremind-uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --------------------------------------------------
// Multer Storage
// --------------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;

    const sanitizedName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    cb(
      null,
      `${uniqueSuffix}-${sanitizedName}`
    );
  },
});

// --------------------------------------------------
// File Filter
// --------------------------------------------------

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".docx",
    ".doc",
    ".txt",
  ];

  const ext = path
    .extname(file.originalname)
    .toLowerCase();

  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "application/octet-stream",
  ];

  if (
    allowedExtensions.includes(ext) ||
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type (${ext}). Only PDF, DOCX, DOC, and TXT files up to 4MB are supported.`
      ),
      false
    );
  }
};

// --------------------------------------------------
// Multer Configuration
// --------------------------------------------------

export const uploadResume = multer({
  storage,

  limits: {
    // Keep below Vercel's function request limit.
    fileSize: 4 * 1024 * 1024,
  },

  fileFilter,
});

