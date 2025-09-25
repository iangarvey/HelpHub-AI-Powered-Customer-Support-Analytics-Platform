// Manages authentication-related operations (login, registration, logout, token refresh).

import Send from "@utils/response.utils.js";
import { prisma } from "../db.js";
import type { Request, Response } from "express";
import authSchema from "validations/auth.schema.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import authConfig from "@config/auth.config.js";

class AuthController {
    static login = async (req: Request, res: Response) => {
        // Destructure the request body into the expected fields
        const { email, password } = req.body as z.infer<typeof authSchema.login>;

        try {
            // 1. Check if the email already exists in the database
            const user = await prisma.user.findUnique({
                where: { email }
            });
            // If user does not exist, return an error
            if (!user) {
                return Send.error(res, null, "Invalid credentials");
            }

            // 2. Compare the provided password with the hashed password stored in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return Send.error(res, null, "Invalid credentials.");
            }

            // 3. Generate an access token (JWT) with a short expiration time (e.g., 15 minutes)
            const accessToken = jwt.sign(
                { userId: user.id },
                authConfig.secret,  // Use the secret from the authConfig for signing the access token
                { expiresIn: authConfig.secret_expires_in as any }  // Use the expiration time from the config (e.g., "15m")
            );

            // 4. Generate a refresh token with a longer expiration time (e.g., 7 days)
            const refreshToken = jwt.sign(
                { userId: user.id, },
                authConfig.refresh_secret,  // Use the separate secret for signing the refresh token
                { expiresIn: authConfig.refresh_secret_expires_in as any }  // Use the expiration time for the refresh token (e.g., "24h")
            );

            // 5. Store the refresh token in the database (optional)
            await prisma.user.update({
                where: { email },
                data: { refreshToken }
            });

            // 6. Set the access token and refresh token in HttpOnly cookies
            // This ensures that the tokens are not accessible via JavaScript and are sent automatically with each request
            // The access token expires quickly and is used for authenticating API requests
            // The refresh token is stored to allow renewing the access token when it expires

            res.cookie("accessToken", accessToken, {
                httpOnly: true,   // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
                secure: process.env.NODE_ENV === "production",  // Set to true in production for HTTPS-only cookies
                maxAge: 15 * 60 * 1000,  // 15 minutes in mileseconds
                sameSite: "strict"  // Ensures the cookie is sent only with requests from the same site
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,  // 24 hours is mileseconds
                sameSite: "strict"
            });

            // 7. Return a successful response with the user's basic information (without sending tokens in the response body)
            return Send.success(res, {
                id: user.id,
                username: user.username,
                email: user.email
            });

        } catch (error) {
            // If any error occurs, return a generic error response
            console.error("Login Failed:", error); // Log the error for debugging
            return Send.error(res, null, "Login failed.");
        }

    }
    static register = async (req: Request, res: Response) => {
        // Destructure the request body into the expected fields
        const { username, email, password, password_confirmation } = req.body as z.infer<typeof authSchema.register>;

        try {
            // 1. Check if the email already exists in the database
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            // If a user with the same email exists, return an error response
            if (existingUser) {
                return Send.error(res, null, "Email is already in use.");
            }

            // 2. Hash the password using bcrypt to ensure security before storing it in the DB
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Create a new user in the database with hashed password
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword
                }
            });

            // 4. Return a success response with the new user data (excluding password for security)
            return Send.success(res, {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }, "User successfully registered.");

        } catch (error) {
            // Handle any unexpected errors (e.g., DB errors, network issues)
            console.error("Registration failed:", error); // Log the error for debugging
            return Send.error(res, null, "Registration failed.");
        }

    }
    static logout = async (req: Request, res: Response) => {
        try {
            // 1. We will ensure the user is authenticated before running this controller
            //    The authentication check will be done in the middleware (see auth.routes.ts).
            //    The middleware will check the presence of a valid access token in the cookies.

            // 2. Remove the refresh token from the database (optional, if using refresh tokens)
            const userId = (req as any).user?.userId;  // Assumed that user data is added by the middleware
            if (userId) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { refreshToken: null }  // Clear the refresh token from the database
                });
            }

            // 3. Remove the access and refresh token cookies
            // We clear both cookies here (accessToken and refreshToken)
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            // 4. Send success response after logout
            return Send.success(res, null, "Logged out successfully.");

        } catch (error) {
            // 5. If an error occurs, return an error response
            console.error("Logout failed:", error); // Log the error for debugging
            return Send.error(res, null, "Logout failed.");
        }
    }
    static refreshToken = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId;  // Get userId from the refreshTokenValidation middleware
            const refreshToken = req.cookies.refreshToken;  // Get the refresh token from cookies

            // Check if the refresh token has been revoked
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user || !user.refreshToken) {
                return Send.unauthorized(res, "Refresh token not found");
            }

            // Check if the refresh token in the database matches the one from the client
            if (user.refreshToken !== refreshToken) {
                return Send.unauthorized(res, { message: "Invalid refresh token" });
            }

            // Generate a new access token
            const newAccessToken = jwt.sign(
                { userId: user.id },
                authConfig.secret,
                { expiresIn: authConfig.secret_expires_in as any }
            );

            // Send the new access token in the response
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,  // 15 minutes
                sameSite: "strict"
            });

            return Send.success(res, { message: "Access token refreshed successfully" });

        } catch (error) {
            console.error("Refresh Token failed:", error);
            return Send.error(res, null, "Failed to refresh token");
        }
    }
}

export default AuthController;