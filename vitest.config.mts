import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/generated/**"],
      reporter: ["text", "html", "lcov"],
    },
  },
});
