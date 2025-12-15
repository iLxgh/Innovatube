import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { User } from "../models/User.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, username, email, password, recaptchaToken } = req.body;

        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            res.status(400).json({
                success: false,
                message: "reCAPTCHA verification failed",
            });
            return;
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: existingUser.email === email 
                    ? "Email already registered" 
                    : "Username already taken",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as any }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                },
            },
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message,
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usernameOrEmail, password } = req.body;

        const user = await User.findOne({
            $or: [
                { email: usernameOrEmail.toLowerCase() },
                { username: usernameOrEmail.toLowerCase() },
            ],
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as any }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                },
            },
        });
    } catch (error: any) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
             res.status(200).json({
                success: true,
                message: "If the email exists, a password reset link has been sent",
            });
            return;
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Token",
                message,
            });

            res.status(200).json({
                success: true,
                message: "If the email exists, a password reset link has been sent",
            });
        } catch (error) {
            (user as any).resetPasswordToken = undefined;
            (user as any).resetPasswordExpire = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: "Email could not be sent",
            });
        }
    } catch (error: any) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process request",
        });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;

        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid token",
            });
            return;
        }

        user.password = await bcrypt.hash(password, 10);
        (user as any).resetPasswordToken = undefined;
        (user as any).resetPasswordExpire = undefined;

        await user.save();

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
             throw new Error("JWT_SECRET is not defined");
        }
        
        const authToken = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as any }
        );

        res.status(200).json({
            success: true,
            data: {
                token: authToken,
                 user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                },
            },
        });
    } catch (error: any) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
        });
    }
};
