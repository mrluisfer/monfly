// vite.config.ts
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const preset = process.env.NITRO_PRESET || "vercel";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@prisma/client", "prisma"],
  },
  resolve: {
    alias: {
      lodash: "lodash-es",
    },
  },
  ssr: {
    external: ["@prisma/client", "prisma"],
    noExternal: ["lodash", "lodash-es", "recharts"],
    target: "node",
  },
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    nitro({ preset }),
    viteReact(),
  ],
  nitro: {},
});
