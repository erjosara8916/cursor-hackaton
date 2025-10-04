import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type { Env } from "#/config/env/env.core.server";
import { isProductionEnvironment } from "#/config/env/env.core.server";
import * as schema from "#/db/db.schema.server";

type UnknownPostgresTypes = Record<string, postgres.PostgresType<unknown>>;

export type DrizzleDatabaseClient = ReturnType<
  typeof drizzle<typeof schema, postgres.Sql<UnknownPostgresTypes>>
>;

const MAX_NUMBER_OF_CONNECTIONS = 5;

const SQL_CLIENT_PRODUCTION_OPTIONS: postgres.Options<UnknownPostgresTypes> = {
  /**
   * Stay within Workers' limit of 6 open sockets on the free plan
   * https://developers.cloudflare.com/workers/platform/limits/
   */
  max: MAX_NUMBER_OF_CONNECTIONS,
  ssl: "require",
};

export const createDrizzleDatabaseClient = (
  env: Env,
): DrizzleDatabaseClient => {
  const isProduction = isProductionEnvironment(env);

  const queryClient = postgres<UnknownPostgresTypes>(
    // TODO: Replace with actual database URL
    // env.DATABASE_URL,
    "",
    isProduction ? SQL_CLIENT_PRODUCTION_OPTIONS : undefined,
  );

  return drizzle({
    casing: "snake_case",
    client: queryClient,
    logger: !isProduction,
    schema,
  });
};
