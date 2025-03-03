import { drizzle } from "drizzle-orm/d1";
import { Env } from "../types";
import * as schema from "./schema";

export function createDB(env: Env["Bindings"]) {
  const db = drizzle(env.DB, { schema });
  return db;
}
