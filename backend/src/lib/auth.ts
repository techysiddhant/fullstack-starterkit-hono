import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDB } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(createDB, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
});
