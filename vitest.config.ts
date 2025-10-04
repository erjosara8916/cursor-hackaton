import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    coverage: {
      all: true,
      include: ["app/**/*.{ts,tsx}"],
      provider: "istanbul",
    },
    environment: "happy-dom",
    include: ["./app/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    setupFiles: ["./app/tests/setup-test-env.ts"],
  },
});
