import { getAuth } from "@clerk/react-router/server";
import type { MiddlewareFunction } from "react-router";
import { redirect } from "react-router";

export const sessionMiddleware = <
  TMiddlewareResult,
>(): MiddlewareFunction<TMiddlewareResult> => {
  return async (args) => {
    const { userId } = await getAuth(args);

    if (typeof userId !== "string") {
      // TODO: Replace with the actual account portal URL
      const signInURL = new URL("/sign-in", "http://localhost:3000");

      signInURL.searchParams.set("redirect_url", args.request.url);

      throw redirect(signInURL.toString());
    }
  };
};
