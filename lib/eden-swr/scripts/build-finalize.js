// This script runs after the TypeScript build to finalize any necessary post-processing
import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Finalizing build...");

// Generate type declarations using tsc
try {
  console.log("Generating type declarations...");
  execSync("npx tsc --declaration --emitDeclarationOnly --outDir dist", {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
  });
  console.log("Type declarations generated successfully!");
} catch (error) {
  console.error("Error generating type declarations:", error);
  process.exit(1);
}

// Add any post-build processing here if needed
// For example, you could copy additional files, modify outputs, etc.

console.log("Build finalization complete!");
