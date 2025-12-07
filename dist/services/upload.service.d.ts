interface UploadResult {
    fileUrl: string;
    thumbnailUrl?: string | undefined;
    optimizedUrl?: string | undefined;
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
export declare const uploadFileToCloudinary: (fileBuffer: Buffer, fileName: string, mimeType: string, folder?: string) => Promise<UploadResult>;
/**
 * Xóa file từ Cloudinary
 * @param publicId - Public ID của file trên Cloudinary
 * @param resourceType - Loại resource (image/video/raw)
 */
export declare const deleteFileFromCloudinary: (publicId: string, resourceType?: "image" | "video" | "raw") => Promise<void>;
/**
 * Xác định messageType từ mimeType
 */
export declare const getMessageTypeFromMimeType: (mimeType: string) => "image" | "video" | "file";
/**
 * Generate URL tối ưu cho image với các options tùy chỉnh
 * @param publicId - Public ID của image trên Cloudinary
 * @param options - Options cho transformation
 */
export declare const generateOptimizedImageUrl: (publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "limit" | "scale" | "fit";
    quality?: "auto:low" | "auto:good" | "auto:best" | "auto";
}) => string;
/**
 * Generate thumbnail URL cho image
 * @param publicId - Public ID của image trên Cloudinary
 * @param size - Kích thước thumbnail (mặc định 200x200)
 */
export declare const generateThumbnailUrl: (publicId: string, size?: number) => string;
/**
 * Generate responsive image URLs cho multiple screen sizes
 * @param publicId - Public ID của image trên Cloudinary
 */
export declare const generateResponsiveImageUrls: (publicId: string) => {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
};
export {};
//# sourceMappingURL=upload.service.d.ts.map