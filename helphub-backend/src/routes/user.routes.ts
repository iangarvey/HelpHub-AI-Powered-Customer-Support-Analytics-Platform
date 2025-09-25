// Routes for user-related endpoints (e.g., /user/info).

import BaseRouter, { RouteConfig } from "./router";
import AuthMiddleware from "@middlewares/auth.middleware";
import UserController from "@controllers/user.controller";

class UserRoutes extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                // get user info
                method: "get",
                path: "/info", // api/user/info
                middlewares: [
                    AuthMiddleware.authenticateUser
                ],
                handler: UserController.getUser
            },
        ]
    }
}

export default new UserRoutes().router;