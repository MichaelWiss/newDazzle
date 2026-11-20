import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const dataFile = path.join(root, "assets/js/data.js");
const mediaDir = path.join(root, "public/assets/img");

const dataContents = fs.readFileSync(dataFile, "utf8");
const mediaPathRegex = /\/assets\/img\/[A-Za-z0-9._&-]+\.(?:webp|webm|mp4|png)/g;
const mediaPaths = [...new Set(dataContents.match(mediaPathRegex) || [])];

if (mediaPaths.length === 0) {
  console.error("No media paths found in assets/js/data.js");
  process.exit(1);
}

const pngRefs = mediaPaths.filter((mediaPath) => mediaPath.endsWith(".png"));
if (pngRefs.length > 0) {
  console.error("Found unsupported .png references in assets/js/data.js:");
  pngRefs.forEach((mediaPath) => console.error(` - ${mediaPath}`));
  process.exit(1);
}

const missingFiles = mediaPaths.filter((mediaPath) => {
  const relPath = mediaPath.replace("/assets/img/", "");
  const absPath = path.join(mediaDir, relPath);
  return !fs.existsSync(absPath);
});

if (missingFiles.length > 0) {
  console.error("Found missing media files under public/assets/img:");
  missingFiles.forEach((mediaPath) => console.error(` - ${mediaPath}`));
  process.exit(1);
}

console.log(
  `Media path check passed: ${mediaPaths.length} references validated against public/assets/img`,
);
