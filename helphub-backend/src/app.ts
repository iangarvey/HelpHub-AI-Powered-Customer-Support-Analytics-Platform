// Configures the Express application, initializes middlewares, and registers routes.

import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "@routes/auth.routes";
import appConfig from "@config/app.config";
import userRoutes from "@routes/user.routes";

class App {
    private app: Express;

    constructor() {
        this.app = express()

        this.initMiddlewares();
        this.initRoutes();
    }

    private initMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(cors({
            origin: [
                'http://localhost:3000', // your frontend url
                'https://mywebsite.com' // your production url optional
            ],
            methods: ["GET", "POST", "DELETE"],
            credentials: true
        }))
    }

    private initRoutes() {
        // /api/auth/*
        this.app.use("/api/auth", authRoutes);
        // /api/user/*
        this.app.use("/api/user", userRoutes);
    }

    public start() {
        const { port, host } = appConfig;

        this.app.listen(port, host, () => {
            console.log(`server is running on http://${host}:${port}`);

        })
    }
}

export default App;