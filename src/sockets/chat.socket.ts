/**
 * Socket Events Documentation cho Chat Application
 *
 * ===========================================
 * CLIENT -> SERVER EVENTS
 * ===========================================
 *
 * 1. mark-as-read
 *    Đánh dấu tin nhắn trong conversation là đã đọc
 *    Payload: { conversationId: string }
 *
 * ===========================================
 * SERVER -> CLIENT EVENTS
 * ===========================================
 *
 * 1. message-read
 *    Thông báo khi có user đánh dấu đã đọc tin nhắn
 *    Payload: {
 *      conversationId: string,
 *      userId: string,
 *      seenBy: string[],
 *      timestamp: Date
 *    }
 *
 * 2. online-users
 *    Danh sách users đang online
 *    Payload: string[] (array of user IDs)
 *
 * 3. error
 *    Thông báo lỗi từ server
 *    Payload: { message: string }
 *
 * ===========================================
 * USAGE EXAMPLE (Frontend)
 * ===========================================
 *
 * // Đánh dấu đã đọc tin nhắn
 * socket.emit('mark-as-read', { conversationId: 'xxx' });
 *
 * // Lắng nghe khi có người đọc tin nhắn
 * socket.on('message-read', (data) => {
 *   console.log(`User ${data.userId} đã đọc conversation ${data.conversationId}`);
 *   // Update UI: hiển thị "Đã xem" hoặc avatar người đã xem
 * });
 *
 * // Lắng nghe danh sách online users
 * socket.on('online-users', (userIds) => {
 *   console.log('Online users:', userIds);
 * });
 *
 * // Lắng nghe lỗi
 * socket.on('error', (error) => {
 *   console.error('Socket error:', error.message);
 * });
 */

export {};
