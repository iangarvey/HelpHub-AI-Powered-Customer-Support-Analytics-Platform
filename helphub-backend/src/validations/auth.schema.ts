// Defines validation schemas for authentication-related requests (e.g., login, registration).

import { z } from "zod";

const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[@$!%*?&]/, "Password must include at least one special character");

const usernameSchema = z.string()
    .min(6, "Username must be at least 6 characters long")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .refine((value) => !/^\d+$/.test(value), {
        message: "Username cannot be only numbers",
    })
    .refine((value) => !/[@$!%*?&]/.test(value), {
        message: "Username cannot contain special characters like @$!%*?&",
    });

const login = z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

const register = z.object({
    username: usernameSchema,
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
    password_confirmation: z.string().min(1, "Password confirmation is required")
}).refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match"
});

const authSchema = {
    login,
    register
}

export default authSchema;