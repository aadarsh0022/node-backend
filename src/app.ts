// src/app.ts
import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { initORM } from "./lib/db";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { env } from "./lib/env";
import { logger } from "./lib/logger";

const app = express();

// Security and utility middleware
app.use(cors({
    origin: true, // For development, allow all origins or specifically "http://localhost:5173"
    credentials: true, // Required for cookies
}));
app.use(express.json());
app.use(cookieParser());

// HTTP Request Logging
const morganFormat = env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

// Global Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 50, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);

// Error middleware must be registered AFTER routes
app.use(errorMiddleware);

(async () => {
    const orm = await initORM();

    app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT}`);
    });
})();