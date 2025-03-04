import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db";
import { Env } from "../types";
export const initAuth = (env: Env["Bindings"]) => {
  return betterAuth({
    database: drizzleAdapter(createDB, {
      provider: "sqlite", // or "mysql", "sqlite"
    }),
    trustedOrigins: [env.ORIGIN_URL],
    emailAndPassword: {
      enabled: true,
    },
  });
};
