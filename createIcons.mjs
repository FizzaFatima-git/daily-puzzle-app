import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// Make sure public folder exists
const publicDir = resolve("./public");
if (!existsSync(publicDir)) {
  mkdirSync(publicDir);
}

// Simple blank PNG (1x1 white pixel) repeated to desired size
function createBlankPng(size) {
  // minimal PNG data for a white square (not complex)
  return Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000" +
      size.toString(16).padStart(8, "0") +
      size.toString(16).padStart(8, "0") +
      "0802000000907705f90000000173424954080808087c08d0fa0000000a4944415408d76360000000020001" +
      "e219a5740000000049454e44ae426082",
    "hex"
  );
}

// Create icons
writeFileSync(resolve(publicDir, "icon-192.png"), createBlankPng(192));
writeFileSync(resolve(publicDir, "icon-512.png"), createBlankPng(512));

console.log("✅ Placeholder icons created in public folder!");



