import { AsyncLocalStorage } from "node:async_hooks";

import type { MiddlewareFunction, RouterContextProvider } from "react-router";

const RouterStorage = new AsyncLocalStorage<{
  context: Readonly<RouterContextProvider>;
  request: Request;
}>();

export const routerStorageMiddleware = <
  TResult,
>(): MiddlewareFunction<TResult> => {
  return async (args, next) => {
    return RouterStorage.run(
      {
        context: args.context,
        request: args.request,
      },
      next,
    );
  };
};

export const getRouterContext = () => {
  const store = RouterStorage.getStore();

  if (store == null) {
    throw new Error("Failed to retrieve context storage.");
  }

  return store.context;
};

export const getRouterRequest = () => {
  const store = RouterStorage.getStore();

  if (store == null) {
    throw new Error("Failed to retrieve context storage.");
  }

  return store.request;
};
