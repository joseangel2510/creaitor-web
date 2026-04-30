import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const url = process.argv[2] || "http://localhost:3000";
const selector = process.argv[3] || "#contacto";
const label = process.argv[4] || "section";

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, 3000));
const el = await page.$(selector);
if (!el) {
  console.error("Selector not found:", selector);
  process.exit(1);
}
await el.scrollIntoView();
await new Promise((r) => setTimeout(r, 800));
const filepath = path.join(ROOT, "temporary screenshots", `screenshot-section-${label}.png`);
await el.screenshot({ path: filepath });
console.log("Saved:", filepath);
await browser.close();
