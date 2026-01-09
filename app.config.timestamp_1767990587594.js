// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  server: {
    preset: "vercel",
    rollupConfig: {
      external: ["@prisma/client", "prisma"]
    }
  },
  tsr: {
    appDirectory: "src"
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ],
    resolve: {
      alias: {
        lodash: "lodash-es"
      }
    },
    ssr: {
      external: ["@prisma/client", "prisma"],
      noExternal: ["lodash", "lodash-es", "recharts"]
    }
  }
});
export {
  app_config_default as default
};
