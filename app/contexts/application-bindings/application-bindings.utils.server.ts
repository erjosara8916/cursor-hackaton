import { getRouterContext } from "#/middlewares/router-storage/router-storage.middleware.server";

import { ApplicationBindingsContext } from "./application-bindings.context.server";

export const getApplicationBindings = () => {
  const routerContext = getRouterContext();

  const applicationBindings = routerContext.get(ApplicationBindingsContext);

  if (applicationBindings == null) {
    throw new Error(
      'Make sure the "ApplicationBindingsContext" can read the "ApplicationBindingsContext" passed as context in the "app/entry.worker.ts" file.',
    );
  }

  return {
    // Bindings ================================================================
    // db: applicationBindings.DATABASE_CLIENT,

    // Environment variables ===================================================
    env: applicationBindings.ENV,
  };
};
