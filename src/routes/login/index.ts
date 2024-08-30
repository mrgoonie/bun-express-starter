import express from "express";
import fs from "fs/promises";
import { githubLoginRouter } from "./github.js";

export const loginRouter = express.Router();

loginRouter.use(githubLoginRouter);

loginRouter.get("/login", async (_, res) => {
  if (res.locals.session) return res.redirect("/");
  return res.render("master", { page: "login" });
});
