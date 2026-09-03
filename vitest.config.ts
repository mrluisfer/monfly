// ponytail: standalone config, not vite.config.mjs — skips the heavy
// tanstackStart/nitro plugins that tests don't need. Add them back only if a
// test actually imports a route that requires the Start plugin transform.
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    tsconfigPaths: true, // honors @/* and ~/* aliases
  },
  test: {
    coverage: {
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.gen.ts",
        "src/components/ui/**",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "html"],
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
  },
});
