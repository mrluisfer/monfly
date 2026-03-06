import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";

const buildSourcemap = process.env.BUILD_SOURCEMAP === "true";
const CLIENT_SENSITIVE_ENV_PATTERN = /^VITE_.*(KEY|SECRET|TOKEN|PASSWORD)/i;

function preventSensitiveClientEnvLeak() {
  return {
    name: "prevent-sensitive-client-env-leak",
    configResolved() {
      const leakedClientSecrets = Object.keys(process.env).filter((envName) =>
        CLIENT_SENSITIVE_ENV_PATTERN.test(envName)
      );

      if (leakedClientSecrets.length === 0) {
        return;
      }

      throw new Error(
        `Sensitive env vars cannot use VITE_ prefix: ${leakedClientSecrets.join(", ")}`
      );
    },
  };
}

export default defineConfig({
  server: {
    preset: "vercel",
    rollupConfig: {
      external: ["@prisma/client", "prisma"],
    },
  },
  tsr: {
    appDirectory: "src",
  },
  vite: {
    build: {
      sourcemap: buildSourcemap,
      minify: "esbuild",
    },
    plugins: [
      preventSensitiveClientEnvLeak(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
    resolve: {
      alias: {
        lodash: "lodash-es",
      },
    },
    ssr: {
      external: ["@prisma/client", "prisma"],
      noExternal: ["lodash", "lodash-es", "recharts"],
    },
  },
});
