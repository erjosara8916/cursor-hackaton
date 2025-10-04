import { z } from "zod/mini";

const baseEnvSchema = z.object({
  // Clerk =====================================================================
  // CLERK_ACCOUNT_PORTAL_URL: z
  //   .string()
  //   .check(z.trim(), createNonEmptySchema(), createURLSchema()),
  // CLERK_PUBLISHABLE_KEY: z.string().check(z.trim(), createNonEmptySchema()),
  // CLERK_SECRET_KEY: z.string().check(z.trim(), createNonEmptySchema()),
  // Database ==================================================================
  // DATABASE_URL: z
  //   .string()
  //   .check(z.trim(), createNonEmptySchema(), createURLSchema()),
});

type BaseEnv = z.output<typeof baseEnvSchema>;

const localEnvSchema = z.object({
  ENVIRONMENT: z.literal("development"),
});

const productionEnvSchema = z.object({
  ENVIRONMENT: z.enum(["production"]),
});

export const envSchema = z.intersection(
  baseEnvSchema,
  z.discriminatedUnion("ENVIRONMENT", [localEnvSchema, productionEnvSchema]),
);

export type Env = z.output<typeof envSchema>;

/**
 * Checks if the current environment is production.
 *
 * @param env The environment object.
 * @returns `true` if the environment is production, `false` otherwise.
 */
export const isProductionEnvironment = (
  env: Env,
): env is BaseEnv & z.output<typeof productionEnvSchema> => {
  return z.safeParse(productionEnvSchema, env).success;
};
