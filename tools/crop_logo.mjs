import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const inputPath = path.join(ROOT, "brand_assets", "Ocre clean.png");
const outputPath = path.join(ROOT, "brand_assets", "logo-cropped.png");

const dataUri = "data:image/png;base64," + fs.readFileSync(inputPath).toString("base64");

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();

await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;"><img id="img" src="${dataUri}"></body></html>`, { waitUntil: "load" });

await page.waitForFunction(() => {
  const img = document.getElementById("img");
  return img && img.complete && img.naturalWidth > 0;
}, { timeout: 15000 });

const result = await page.evaluate(async () => {
  const img = document.getElementById("img");
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropX = minX;
  const cropY = minY;
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const padding = Math.round(Math.max(cropW, cropH) * 0.04);
  const out = document.createElement("canvas");
  out.width = cropW + padding * 2;
  out.height = cropH + padding * 2;
  const octx = out.getContext("2d");
  octx.drawImage(canvas, cropX, cropY, cropW, cropH, padding, padding, cropW, cropH);
  return out.toDataURL("image/png");
});

const base64 = result.split(",")[1];
fs.writeFileSync(outputPath, Buffer.from(base64, "base64"));
const stat = fs.statSync(outputPath);
console.log(`Cropped logo saved: ${outputPath} (${(stat.size / 1024).toFixed(1)} KB)`);

await browser.close();
