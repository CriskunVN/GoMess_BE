import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
//1. Middleware
app.use(cors());
app.use(morgan("dev")); // Ghi log các request
app.use(express.json());
//2. Routes
const apiPrefix = process.env.API_PREFIX || "/api/v1";
app.get(`${apiPrefix}/`, (req, res) => {
    res.send("ChatApp backend is running!");
});
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
export default app;
//# sourceMappingURL=app.js.map