import { Hono } from "hono";
import { initAuth } from "./lib/auth";
import { cors } from "hono/cors";
import { Env, SessionAuth, UserAuth } from "./types";
import { createDB } from "./db";
import { profile, user } from "./db/schema";
import { eq } from "drizzle-orm";

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
app.get("/profile", async (c) => {
  const db = createDB(c.env as Env["Bindings"]);
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  try {
    const profileData = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, user.id));
    return c.json(profileData);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
app.get("/:username", async (c) => {
  const { username } = c.req.param();
  const db = createDB(c.env as Env["Bindings"]);
  try {
    const userData = await db
      .select()
      .from(user)
      .where(eq(user.username, username));
    return c.json(userData);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
app.post("/settings", async (c) => {
  const db = createDB(c.env as Env["Bindings"]);
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const { fullName, customDomain } = await c.req.json();
  try {
    const profileData = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, user.id));
    // console.log(profileData);
    if (profileData.length === 0) {
      await db.insert(profile).values({
        userId: user.id,
        fullName: fullName,
        customDomain: customDomain,
      });
      return c.json({ success: true });
    } else {
      await db
        .update(profile)
        .set({
          fullName: fullName,
          customDomain: customDomain,
        })
        .where(eq(profile.userId, user.id));
      return c.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export default app;
