import express from "express";
import { verifyRequest, validateSession } from "./lib/auth";

import { mainRouter } from "./routes/index.js";
import { loginRouter } from "./routes/login/index.js";
import { logoutRouter } from "./routes/logout.js";

import type { User, Session } from "lucia";
import { env } from "./env.js";
import path from "path";

const app = express();
app.use(express.urlencoded({ extended: true }));

// template engine: EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// assets
app.use(express.static(path.join(__dirname, "../public")));

// auth middleware: verify request origin & validate session
app.use(verifyRequest);
app.use(validateSession);

// routes
app.use(mainRouter, loginRouter, logoutRouter);

// start
app.listen(env.PORT);

console.log(`Server running on port ${env.PORT}`);

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
