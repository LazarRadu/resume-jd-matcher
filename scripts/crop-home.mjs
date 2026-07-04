import sharp from "sharp";

const src = "public/screenshots/01-home.png";
const img = sharp(src);
const meta = await img.metadata();
// Keep the top portion (header + form + button), drop the empty white space below.
const height = Math.min(meta.height, 1240);
await sharp(src)
  .extract({ left: 0, top: 0, width: meta.width, height })
  .toFile("public/screenshots/01-home-cropped.png");
console.log(`cropped ${meta.width}x${meta.height} -> ${meta.width}x${height}`);
