import { NextFunction, Request, Response } from "express";
import { login, refreshTokenService, signup } from "../services/auth.service";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import { env } from "../lib/env";

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    const validatedUser = signupSchema.parse(req.body);

    const user = await signup(validatedUser);

    return res.status(201).json({
        message: "User created successfully",
        user,
    });
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    const parsed = loginSchema.parse(req.body);

    const result = await login(parsed);

    // Secure cookie storage for refresh token
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(result);
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    const result = await refreshTokenService(refreshToken);

    res.json(result);
};