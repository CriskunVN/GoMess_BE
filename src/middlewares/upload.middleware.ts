import multer from "multer";
import path from "path";

// Cấu hình storage - lưu tạm trong memory
const storage = multer.memoryStorage();

// File filter để validate file type
const fileFilter = (req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/x-rar-compressed",
    "text/plain",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type không được hỗ trợ: ${file.mimetype}. Chỉ chấp nhận: images, videos, pdf, docs, excel, zip, txt`
      ),
      false
    );
  }
};

// Cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Middleware để upload single file
export const uploadSingleFile = upload.single("file");

// Middleware để upload multiple files
export const uploadMultipleFiles = upload.array("files", 5); // Max 5 files

export default upload;
