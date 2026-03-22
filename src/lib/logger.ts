import winston from "winston";
import { env } from "./env";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
    level: env.NODE_ENV === "production" ? "info" : "debug",
    // In production, log raw JSON for external aggregators (like Datadog/CloudWatch)
    // In dev, use colorized readable formats
    format: combine(
        errors({ stack: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        env.NODE_ENV === "production" ? json() : combine(colorize(), logFormat)
    ),
    transports: [
        new winston.transports.Console()
    ],
});
