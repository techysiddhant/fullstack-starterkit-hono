import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db";
import { Env } from "../types";
import { admin, username } from "better-auth/plugins";
export const initAuth = (env: Env["Bindings"]) => {
  return betterAuth({
    database: drizzleAdapter(createDB, {
      provider: "sqlite", // or "mysql", "sqlite"
    }),
    plugins: [admin(), username()],
    trustedOrigins: [env.ORIGIN_URL],
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
    emailAndPassword: {
      enabled: true,
    },
  });
};
