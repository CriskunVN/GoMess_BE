import "dotenv/config"; // Load environment variables BEFORE other imports
import { connectDB } from "./libs/db.js";
// Import the sockets server from the local src path so the compiled output resolves to dist/sockets/index.js
import { server } from "./sockets/index.js";
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB()
    .then(() => {
    // Start the server
    server.listen(PORT, () => {
        console.log(`Server & Socket.io running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map