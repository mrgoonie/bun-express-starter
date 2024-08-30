import express from "express";
import { prisma } from "../lib/db";

export const mainRouter = express.Router();

mainRouter.get("/", async (_, res) => {
  if (!res.locals.user) {
    return res.redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: res.locals.user.id },
  });

  return res.render("master", { page: "index", user });
});
