import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

function getGitHubPagesBasePath() {
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }

  if (process.env.GITHUB_ACTIONS !== "true") {
    return "/";
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

  if (repositoryName?.endsWith(".github.io")) {
    return "/";
  }

  return repositoryName ? `/${repositoryName}/` : "/";
}

export default defineConfig({
  base: getGitHubPagesBasePath(),
  plugins: [react()],
  build: {
    outDir: ".artifacts/dist",
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: ["tests/e2e/**", "node_modules/**", ".artifacts/**", "dist/**"],
    coverage: {
      provider: "v8",
      reportsDirectory: ".artifacts/coverage",
    },
  },
});
