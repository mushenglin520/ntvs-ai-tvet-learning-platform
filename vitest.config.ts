import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({mode})=>{
  Object.assign(process.env,loadEnv(mode,process.cwd(),""));
  return {
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
    test: {
      environment: "node",
      include: ["src/tests/**/*.test.ts"],
      sequence: { concurrent: false },
    },
  };
});
