import bcrypt from "bcrypt";
import { User } from "../lib/db/entities/User";
import { orm } from "../lib/db";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { env } from "../lib/env";


export const signup = async (data: {
    email: string;
    password: string;
}) => {
    const em = orm.em.fork();

    // check if user exists
    const existingUser = await em.findOne(User, { email: data.email });

    if (existingUser) {
        throw new AppError("User already exists", 400);
    }

    // hash password 
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // create User
    const user = em.create(User, {
        email: data.email,
        password: hashedPassword,
        isVerified: false,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
    });

    await em.persist(user).flush();

    return {
        id: user.id,
        email: user.email,
    };
};

export const login = async (data: {
    email: string;
    password: string;
}) => {
    const em = orm.em.fork();

    const user = await em.findOne(User, { email: data.email });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid password", 401);
    }

    // JWT GENERATION
    const accessToken = jwt.sign(
        { userId: user.id },
        env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    // REFRESH TOKEN GENERATION
    const refreshToken = jwt.sign(
        { userId: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await em.persist(user).flush();

    return {
        accessToken,
        refreshToken,
    };
};


export const refreshTokenService = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError("No refresh token provided", 400);
    }

    const em = orm.em.fork();

    try {
        const decoded = jwt.verify(
            refreshToken,
            env.JWT_REFRESH_SECRET
        ) as { userId: string };

        const user = await em.findOne(User, {
            id: decoded.userId,
        });

        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError("Invalid refresh token", 401);
        }

        const newAccessToken = jwt.sign(
            { userId: user.id },
            env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return { accessToken: newAccessToken };
    } catch (error) {
        throw new AppError("Invalid refresh token", 401);
    }
};