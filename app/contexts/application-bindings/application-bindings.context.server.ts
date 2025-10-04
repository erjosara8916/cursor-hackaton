import { createContext } from "react-router";

import type { Env } from "#/config/env/env.core.server";
// import type { DrizzleDatabaseClient } from "#/db/db.client.server";

export type ApplicationBindings = {
  // Bindings ==================================================================
  // DATABASE_CLIENT: DrizzleDatabaseClient;

  // Environment variables =====================================================
  ENV: Env;
};

export const ApplicationBindingsContext =
  createContext<ApplicationBindings | null>(null);
