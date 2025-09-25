// The entry point of the application. Bootstraps and starts the server.

import "tsconfig-paths/register";
import "dotenv/config"

import App from "app";

const app = new App;

app.start();