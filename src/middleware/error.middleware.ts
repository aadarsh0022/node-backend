import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../lib/logger";

export const errorMiddleware = (err: Error | unknown, req: Request, res: Response, next: NextFunction) => {
    logger.error(err); // for debugging

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.issues, // return the specific field issues
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Default 500 fallback
    res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Internal Server Error",
    });
};