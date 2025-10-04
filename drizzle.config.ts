import { defineConfig } from "drizzle-kit";
// import { z } from "zod/mini";

// import { envSchema } from "#/config/env/env.core.server";

// const env = z.parse(envSchema, process.env);

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    // TODO: Replace with actual database URL
    // url: env.DATABASE_URL,
    url: "",
  },
  dialect: "postgresql",
  out: "./app/db/migrations",
  schema: "./app/db/db.schema.server.ts",
  strict: true,
  verbose: true,
});
