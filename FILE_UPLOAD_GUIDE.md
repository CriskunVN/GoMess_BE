# 📤 Hướng dẫn Gửi Tin Nhắn (Text + File) trong Chat

## 📋 Tổng quan

API cho phép gửi tin nhắn **text thuần** HOẶC **text + file** (hình ảnh, video, document) trong cùng một endpoint. Frontend chỉ cần một form duy nhất!

## 🎯 API Endpoints

### 1. POST `/api/messages/direct`

Gửi tin nhắn trực tiếp (1-1 chat)

### 2. POST `/api/messages/group`

Gửi tin nhắn nhóm (group chat)

## 🔧 Cài đặt

### 1. Dependencies đã cài:

```bash
npm install multer cloudinary @types/multer
```

### 2. Cấu hình Cloudinary

Đăng ký tại: https://cloudinary.com/

Thêm vào file `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📡 API Usage

### Request Headers:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Request Body (form-data):

#### Gửi tin nhắn Direct:

| Field          | Type   | Required | Description                 |
| -------------- | ------ | -------- | --------------------------- |
| recipientId    | String | Yes      | ID người nhận               |
| content        | String | No\*     | Nội dung tin nhắn           |
| conversationId | String | No       | ID cuộc trò chuyện (nếu có) |
| file           | File   | No\*     | File đính kèm               |

\*Chú ý: Phải có ít nhất `content` HOẶC `file`

#### Gửi tin nhắn Group:

| Field          | Type   | Required | Description             |
| -------------- | ------ | -------- | ----------------------- |
| conversationId | String | Yes      | ID cuộc trò chuyện nhóm |
| content        | String | No\*     | Nội dung tin nhắn       |
| file           | File   | No\*     | File đính kèm           |

\*Chú ý: Phải có ít nhất `content` HOẶC `file`

### Supported File Types:

**Images:** jpeg, jpg, png, gif, webp  
**Videos:** mp4, mpeg, quicktime, avi, webm  
**Documents:** pdf, doc, docx, xls, xlsx, zip, rar, txt

**Max file size:** 50MB

### Response Success (201):

```json
{
  "status": "success",
  "message": "Gửi tin nhắn thành công", // hoặc "Gửi tin nhắn có file thành công"
  "data": {
    "message": {
      "_id": "message_id",
      "conversationId": "conv_id",
      "senderId": "user_id",
      "content": "Hello!",
      "messageType": "text", // "text" | "image" | "video" | "file"
      "fileUrl": "https://res.cloudinary.com/...", // nếu có file
      "fileInfo": {
        // nếu có file
        "fileName": "image.jpg",
        "fileSize": 1024000,
        "mimeType": "image/jpeg"
      },
      "createdAt": "2025-12-06T...",
      "updatedAt": "2025-12-06T..."
    }
  }
}
```

## 🧪 Test với Postman/Thunder Client

### Scenario 1: Gửi tin nhắn TEXT thuần (không có file)

**Request:**

- Method: `POST`
- URL: `http://localhost:3000/api/messages/direct`
- Headers: `Authorization: Bearer your_token`
- Body (form-data):
  ```
  recipientId: "user_id_here"
  content: "Hello, how are you?"
  ```

### Scenario 2: Gửi tin nhắn với FILE + TEXT

**Request:**

- Method: `POST`
- URL: `http://localhost:3000/api/messages/direct`
- Headers: `Authorization: Bearer your_token`
- Body (form-data):
  ```
  recipientId: "user_id_here"
  content: "Check this image!"
  file: [chọn file image.jpg]
  ```

### Scenario 3: Gửi CHỈ FILE (không có text)

**Request:**

- Method: `POST`
- URL: `http://localhost:3000/api/messages/direct`
- Headers: `Authorization: Bearer your_token`
- Body (form-data):
  ```
  recipientId: "user_id_here"
  file: [chọn file video.mp4]
  ```

## 💻 Frontend Integration

### React Example - Unified Message Input Component

```jsx
import { useState, useRef } from "react";
import axios from "axios";

function MessageInput({ conversationId, recipientId, isGroup = false }) {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > 50 * 1024 * 1024) {
      alert("File quá lớn! Max 50MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send message (text and/or file)
  const sendMessage = async () => {
    // Validate: phải có content hoặc file
    if (!content.trim() && !selectedFile) {
      alert("Vui lòng nhập tin nhắn hoặc chọn file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      // Thêm fields dựa vào loại chat
      if (isGroup) {
        formData.append("conversationId", conversationId);
      } else {
        formData.append("recipientId", recipientId);
        if (conversationId) {
          formData.append("conversationId", conversationId);
        }
      }

      // Thêm content nếu có
      if (content.trim()) {
        formData.append("content", content);
      }

      // Thêm file nếu có
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Gọi API
      const endpoint = isGroup ? "/api/messages/group" : "/api/messages/direct";
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload: ${percentCompleted}%`);
        },
      });

      console.log("Message sent:", response.data);

      // Reset form
      setContent("");
      removeFile();
    } catch (error) {
      console.error("Send failed:", error);
      alert("Gửi tin nhắn thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="message-input">
      {/* File Preview */}
      {selectedFile && (
        <div className="file-preview">
          {preview ? (
            <img src={preview} alt="Preview" style={{ maxHeight: 200 }} />
          ) : (
            <div className="file-info">
              📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}{" "}
              KB)
            </div>
          )}
          <button onClick={removeFile}>✕ Remove</button>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={(e) => e.key === "Enter" && !uploading && sendMessage()}
        />

        {/* File Picker Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <button onClick={() => fileInputRef.current?.click()}>📎</button>

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={uploading || (!content.trim() && !selectedFile)}
        >
          {uploading ? "⏳" : "📤"}
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
```

### Simple Axios Function

```javascript
// Send message với hoặc không có file
const sendMessage = async (data) => {
  const { recipientId, conversationId, content, file, isGroup = false } = data;

  const formData = new FormData();

  if (isGroup) {
    formData.append("conversationId", conversationId);
  } else {
    formData.append("recipientId", recipientId);
    if (conversationId) formData.append("conversationId", conversationId);
  }

  if (content) formData.append("content", content);
  if (file) formData.append("file", file);

  const endpoint = isGroup ? "/api/messages/group" : "/api/messages/direct";

  const response = await axios.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Usage examples:
// 1. Text only
await sendMessage({
  recipientId: "user123",
  content: "Hello!",
});

// 2. File only
await sendMessage({
  recipientId: "user123",
  file: imageFile,
});

// 3. Text + File
await sendMessage({
  recipientId: "user123",
  content: "Check this!",
  file: imageFile,
});
```

## 🔄 Socket.IO Realtime

Khi tin nhắn được gửi (text hoặc file), tất cả users trong conversation nhận event:

```javascript
socket.on("new-message", (data) => {
  const { message } = data;

  // Hiển thị theo messageType
  switch (message.messageType) {
    case "text":
      console.log("Text:", message.content);
      break;
    case "image":
      console.log("Image:", message.fileUrl);
      // <img src={message.fileUrl} />
      break;
    case "video":
      console.log("Video:", message.fileUrl);
      // <video src={message.fileUrl} />
      break;
    case "file":
      console.log("File:", message.fileInfo.fileName);
      // <a href={message.fileUrl} download>Download</a>
      break;
  }
});
```

## 🎯 Message Types

| messageType | Description          | Khi nào được set          |
| ----------- | -------------------- | ------------------------- |
| `text`      | Tin nhắn text thuần  | Không có file             |
| `image`     | Tin nhắn có hình ảnh | File là image/\*          |
| `video`     | Tin nhắn có video    | File là video/\*          |
| `file`      | Tin nhắn có document | File khác (pdf, doc, etc) |

## ⚠️ Lưu ý Quan Trọng

1. **Multer Middleware:** Đã được thêm vào cả 2 routes (direct & group)
2. **File Optional:** Có thể gửi text only, file only, hoặc cả hai
3. **Content Optional:** Nếu gửi file, content có thể empty
4. **Validation:** Backend sẽ reject nếu không có cả content lẫn file
5. **Max Size:** 50MB per file
6. **Cloudinary Free Tier:** 25GB storage, 25GB bandwidth/month

## ✅ Checklist Implementation

Frontend cần làm:

- [ ] Một form input duy nhất
- [ ] Button chọn file (file picker)
- [ ] Preview file đã chọn
- [ ] Button gửi (submit)
- [ ] Hiển thị progress upload
- [ ] Handle cả text-only và file messages
- [ ] Listen socket event "new-message"

Backend đã có:

- [x] Multer middleware trên cả 2 routes
- [x] Upload service (Cloudinary)
- [x] Auto-detect messageType
- [x] Socket.IO broadcast
- [x] File validation

## � Ưu điểm Approach này

✅ **Simple API:** Chỉ 2 endpoints cho mọi trường hợp  
✅ **Flexible:** Text only, file only, hoặc cả hai  
✅ **UX tốt:** Frontend chỉ cần 1 form, 1 button gửi  
✅ **Maintainable:** Dễ maintain và mở rộng

---

**Updated:** 2025-12-07  
**Version:** 2.0.0
