// Routes for authentication endpoints (e.g., /login, /register).

import AuthController from "@controllers/auth.controller";
import BaseRouter, { RouteConfig } from "./router";
import ValidationMiddleware from "@middlewares/validation.middleware";
import authSchema from "validations/auth.schema";
import AuthMiddleware from "@middlewares/auth.middleware";

class AuthRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                // login
                method: "post",
                path: "/login",
                middlewares: [
                    ValidationMiddleware.validateBody(authSchema.login)
                ],
                handler: AuthController.login
            },
            {
                // register
                method: "post",
                path: "/register",
                middlewares: [
                    ValidationMiddleware.validateBody(authSchema.register)
                ],
                handler: AuthController.register
            },
            {
                // logout
                method: "post",
                path: "/logout",
                middlewares: [
                    // check if user is logged in
                    AuthMiddleware.authenticateUser
                ],
                handler: AuthController.logout
            },

            {
                // refresh token
                method: "post",
                path: "/refresh-token",
                middlewares: [
                    // checks if refresh token is valid
                    AuthMiddleware.refreshTokenValidation
                ],
                handler: AuthController.refreshToken
            },
        ]
    }
}

export default new AuthRouter().router;