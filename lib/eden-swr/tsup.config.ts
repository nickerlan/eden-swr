import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    entry: "./src/index.ts",
    resolve: true,
  },
  onSuccess: () => {
    console.log("Build complete, forcing process exit...");
    process.exit(0);
  },
});
