import { OAuth2RequestError, generateState } from "arctic";
import express from "express";
import { github, lucia } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { generateId } from "lucia";

interface GitHubUser {
  id: number;
  name: string;
  login: string;
}

export const githubLoginRouter = express.Router();

githubLoginRouter.get("/login/github", async (_, res) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);
  res.setHeader(
    "Set-Cookie",
    serializeCookie("github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    }),
  );
  res.redirect(url.toString());
});

githubLoginRouter.get("/login/github/callback", async (req, res) => {
  const code = req.query["code"]?.toString() ?? null;
  const state = req.query["state"]?.toString() ?? null;
  // console.log({ code, state });

  const storedState =
    parseCookies(req.headers.cookie ?? "").get("github_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    console.log(code, state, storedState);
    return res.status(400).end();
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUser = (await githubUserResponse.json()) as GitHubUser;

    const existingAccount = await prisma.account.findUnique({
      where: { providerAccountId: `${githubUser.id}` },
    });

    if (existingAccount) {
      const existingUser = await prisma.user.findUnique({
        where: { id: existingAccount.userId },
      });
      if (!existingUser) throw new Error(`User not existed.`);
      const session = await lucia.createSession(existingUser.id, {});

      return res
        .setHeader(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
        )
        .redirect("/");
    }

    const userId = generateId(15);
    const user = await prisma.user.create({
      data: {
        id: userId,
        name: githubUser.login,
      },
    });
    const account = await prisma.account.create({
      data: {
        id: generateId(15),
        userId: user.id,
        provider: "github",
        providerAccountId: `${githubUser.id}`,
      },
    });

    const session = await lucia.createSession(userId, {});
    console.log(`session :>>`, session);

    return res
      .setHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      )
      .redirect("/");
  } catch (e) {
    console.log(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      res.status(400).end();
      return;
    }
    res.status(500).end();
    return;
  }
});
