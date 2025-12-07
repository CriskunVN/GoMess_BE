import cloudinary from "../libs/cloudinary.js";
import AppError from "../utils/AppError.js";
import { Readable } from "stream";

interface UploadResult {
  fileUrl: string;
  thumbnailUrl?: string | undefined; // Thêm thumbnail URL cho images
  optimizedUrl?: string | undefined; // URL đã tối ưu
  fileName: string;
  fileSize: number;
  mimeType: string;
  publicId: string;
  width?: number | undefined;
  height?: number | undefined;
}

/**
 * Upload file lên Cloudinary với tối ưu hóa
 * @param fileBuffer - Buffer của file
 * @param fileName - Tên file gốc
 * @param mimeType - MIME type của file
 * @param folder - Folder trên Cloudinary (mặc định: 'gomess/messages')
 */
export const uploadFileToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: string = "gomess/messages"
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    // Xác định resource_type dựa trên mimeType
    let resourceType: "image" | "video" | "raw" = "raw";
    if (mimeType.startsWith("image/")) {
      resourceType = "image";
    } else if (mimeType.startsWith("video/")) {
      resourceType = "video";
    }

    // Cấu hình upload với tối ưu hóa
    const uploadOptions: any = {
      folder: folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      // Tối ưu hóa cho images
      ...(resourceType === "image" && {
        transformation: [
          {
            fetch_format: "auto", // Tự động chọn format tốt nhất (webp, avif, etc)
            quality: "auto:good", // Tự động tối ưu quality (auto:low, auto:good, auto:best)
          },
        ],
      }),
      // Tối ưu hóa cho videos
      ...(resourceType === "video" && {
        resource_type: "video",
        eager: [
          {
            width: 1280,
            height: 720,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
        eager_async: true,
      }),
    };

    // Tạo upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(new AppError(`Lỗi upload file: ${error.message}`, 500));
          return;
        }

        if (!result) {
          reject(new AppError("Không nhận được kết quả từ Cloudinary", 500));
          return;
        }

        // URL gốc đã được tối ưu tự động nhờ transformation
        const fileUrl = result.secure_url;

        // Tạo thumbnail URL cho images (200x200, auto-crop)
        let thumbnailUrl: string | undefined;
        let optimizedUrl: string | undefined;

        if (resourceType === "image") {
          // Thumbnail cho preview nhanh
          thumbnailUrl = cloudinary.url(result.public_id, {
            width: 200,
            height: 200,
            crop: "fill",
            gravity: "auto",
            fetch_format: "auto",
            quality: "auto:low",
          });

          // URL tối ưu cho hiển thị trong chat
          optimizedUrl = cloudinary.url(result.public_id, {
            width: 800,
            crop: "limit", // Giới hạn kích thước nhưng giữ tỷ lệ
            fetch_format: "auto",
            quality: "auto:good",
          });
        }

        resolve({
          fileUrl: fileUrl, // URL gốc (đã tối ưu)
          thumbnailUrl: thumbnailUrl || undefined,
          optimizedUrl: optimizedUrl || undefined,
          fileName: fileName,
          fileSize: result.bytes,
          mimeType: mimeType,
          publicId: result.public_id,
          width: result.width || undefined,
          height: result.height || undefined,
        });
      }
    );

    // Convert buffer thành stream và pipe vào uploadStream
    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Xóa file từ Cloudinary
 * @param publicId - Public ID của file trên Cloudinary
 * @param resourceType - Loại resource (image/video/raw)
 */
export const deleteFileFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "raw"
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error: any) {
    throw new AppError(`Lỗi xóa file: ${error.message}`, 500);
  }
};

/**
 * Xác định messageType từ mimeType
 */
export const getMessageTypeFromMimeType = (
  mimeType: string
): "image" | "video" | "file" => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "file";
};

/**
 * Generate URL tối ưu cho image với các options tùy chỉnh
 * @param publicId - Public ID của image trên Cloudinary
 * @param options - Options cho transformation
 */
export const generateOptimizedImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "limit" | "scale" | "fit";
    quality?: "auto:low" | "auto:good" | "auto:best" | "auto";
  }
): string => {
  return cloudinary.url(publicId, {
    width: options?.width || 800,
    height: options?.height,
    crop: options?.crop || "limit",
    fetch_format: "auto",
    quality: options?.quality || "auto:good",
    secure: true,
  });
};

/**
 * Generate thumbnail URL cho image
 * @param publicId - Public ID của image trên Cloudinary
 * @param size - Kích thước thumbnail (mặc định 200x200)
 */
export const generateThumbnailUrl = (
  publicId: string,
  size: number = 200
): string => {
  return cloudinary.url(publicId, {
    width: size,
    height: size,
    crop: "fill",
    gravity: "auto", // Tự động focus vào phần quan trọng nhất
    fetch_format: "auto",
    quality: "auto:low",
    secure: true,
  });
};

/**
 * Generate responsive image URLs cho multiple screen sizes
 * @param publicId - Public ID của image trên Cloudinary
 */
export const generateResponsiveImageUrls = (
  publicId: string
): {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  original: string;
} => {
  return {
    thumbnail: generateThumbnailUrl(publicId, 200),
    small: generateOptimizedImageUrl(publicId, { width: 400 }),
    medium: generateOptimizedImageUrl(publicId, { width: 800 }),
    large: generateOptimizedImageUrl(publicId, { width: 1200 }),
    original: cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto:good",
      secure: true,
    }),
  };
};
