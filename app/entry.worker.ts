import { createRequestHandler, RouterContextProvider } from "react-router";
import { z } from "zod/mini";

import { envSchema } from "./config/env/env.core.server";
import { ApplicationBindingsContext } from "./contexts/application-bindings/application-bindings.context.server";
// import { createDrizzleDatabaseClient } from "./db/db.client.server";

const requestHandler = createRequestHandler(
  async () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const handler: ExportedHandler<Cloudflare.Env> = {
  async fetch(request, unsafeEnvironmentVariables, _ctx) {
    const routerContext = new RouterContextProvider();

    const parsedEnvironmentVariables = z.parse(
      envSchema,
      unsafeEnvironmentVariables,
    );

    // const drizzleDatabaseClient = createDrizzleDatabaseClient(
    //   parsedEnvironmentVariables,
    // );

    routerContext.set(ApplicationBindingsContext, {
      // DATABASE_CLIENT: drizzleDatabaseClient,
      ENV: parsedEnvironmentVariables,
    });

    return requestHandler(request, routerContext);
  },
};

export default handler;
