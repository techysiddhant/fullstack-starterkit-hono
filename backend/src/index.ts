import { Hono } from "hono";
import { initAuth } from "./lib/auth";
import { cors } from "hono/cors";
import { Env, SessionAuth, UserAuth } from "./types";
import { createDB } from "./db";
import { user } from "./db/schema";

const app = new Hono<{
  Bindings: Env["Bindings"];
  Variables: {
    user: UserAuth | null;
    session: SessionAuth | null;
  };
}>();
app.use(
  "*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "http://localhost:3000", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("*", async (c, next) => {
  const auth = initAuth(c.env as Env["Bindings"]);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = initAuth(c.env as Env["Bindings"]);
  return auth.handler(c.req.raw);
});
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
