import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map