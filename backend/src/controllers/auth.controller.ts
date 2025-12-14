import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { verifyRecaptcha } from "../utils/recaptcha.js";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, username, email, password, recaptchaToken } = req.body;

        // Verify reCAPTCHA
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            res.status(400).json({
                success: false,
                message: "reCAPTCHA verification failed",
            });
            return;
        }

        // Check if user already exists
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
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

        // Find user by username or email
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

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
            return;
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }

        const token = jwt.sign(
            { userId: user._id },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
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

        // Always return success to prevent email enumeration
        res.status(200).json({
            success: true,
            message: "If the email exists, a password reset link has been sent",
        });

        // TODO: Implement email sending with reset token
        // For now, just log it
        if (user) {
            console.log(`Password reset requested for user: ${user.email}`);
            // In production, generate a reset token and send email
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

        // TODO: Implement token verification and password reset
        // For now, return not implemented
        res.status(501).json({
            success: false,
            message: "Password reset not fully implemented yet",
        });
    } catch (error: any) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
        });
    }
};
