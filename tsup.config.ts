import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // Update the entry point if needed
  format: ["cjs", "esm"],
  dts: true,
  // Set output file extensions: .mjs for esm and .cjs for commonjs
  outExtension({ format }) {
    return format === "esm" ? { js: ".mjs" } : { js: ".cjs" };
  },
});
