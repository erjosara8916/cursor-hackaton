import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

import { INTERNAL_SERVER_ERROR_STATUS_CODE } from "./constants/http/status-codes/status-codes.constants.server";

export default async function handleRequest(
  request: Request,
  status: number,
  headers: Headers,
  entryContext: EntryContext,
  // routerContext: RouterContextProvider,
) {
  const userAgent = request.headers.get("user-agent");

  let forwardedStatus = status;

  const stream = await renderToReadableStream(
    <ServerRouter context={entryContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console -- Log streaming rendering errors from inside the shell.
        console.error(error);

        forwardedStatus = INTERNAL_SERVER_ERROR_STATUS_CODE;
      },
    },
  );

  if (isbot(userAgent)) await stream.allReady;
  else headers.set("Transfer-Encoding", "chunked");

  headers.set("Content-Type", "text/html; charset=utf-8");

  return new Response(stream, {
    status: forwardedStatus,
    headers,
  });
}
