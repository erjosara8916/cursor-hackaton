// @ts-expect-error -- There are no type declarations for this package.
import "@fontsource-variable/geist";

// import { clerkMiddleware } from "@clerk/react-router/server";
import geistWoff2 from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import globalStyles from "#/app.css?url";

import type { Route } from "./+types/root";
import { ToastNotificationsManager } from "./features/toasts/components/toast-notifications-manager.component";
import { routerStorageMiddleware } from "./middlewares/router-storage/router-storage.middleware.server";
// import { sessionMiddleware } from "./middlewares/session/session.middleware.server";

const PRELOAD_LINKS: Route.LinkDescriptors = [
  {
    rel: "preload",
    as: "font",
    href: geistWoff2,
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    as: "style",
    href: globalStyles,
  },
];

const BASE_LINKS: Route.LinkDescriptors = [
  {
    rel: "stylesheet",
    href: globalStyles,
  },
];

export const links: Route.LinksFunction = () => {
  if (import.meta.env.DEV) return BASE_LINKS;

  return PRELOAD_LINKS.concat(BASE_LINKS);
};

export const middleware: Route.MiddlewareFunction[] = [
  // clerkMiddleware(),
  routerStorageMiddleware(),
  // sessionMiddleware(),
];

type LayoutProps = React.PropsWithChildren;

export const Layout = (props: LayoutProps) => {
  const { children } = props;

  return (
    <html data-theme="forest" lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export default function App() {
  return (
    <>
      <ToastNotificationsManager />

      <Outlet />
    </>
  );
}
