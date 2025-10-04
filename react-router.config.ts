import type { Config } from "@react-router/dev/config";

const reactRouterConfig: Config = {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    // unstable_optimizeDeps: true,

    unstable_splitRouteModules: "enforce",
    unstable_subResourceIntegrity: true,
    unstable_viteEnvironmentApi: true,

    v8_middleware: true,
  },
};

export default reactRouterConfig;
