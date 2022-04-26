// app/sessions.js
import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      // all of these are optional
      expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });
const { getSession, commitSession, destroySession } = sessionStorage;

export { getSession, commitSession, destroySession };