/**
 * OpenRouter Image Generation Tool
 * Uses OpenRouter API to generate images via various models.
 *
 * Usage:
 *   node tools/generate_image.js "prompt" --aspect 16:9 -o media/output.png
 *   node tools/generate_image.js "prompt" --model google/gemini-flash-1.5 -o media/output.png
 *
 * Environment:
 *   OPENROUTER_API_KEY must be set (in .env or system env)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root if it exists
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error("Error: OPENROUTER_API_KEY not found.");
  console.error("Set it in your .env file or as an environment variable.");
  process.exit(1);
}

// Parse CLI arguments
function parseArgs(args) {
  const result = {
    prompt: null,
    output: "media/generated-image.png",
    aspect: "16:9",
    model: "google/gemini-3.1-flash-image-preview", // Nano Banana 2
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === "--aspect" || arg === "-a") {
      result.aspect = args[++i];
    } else if (arg === "-o" || arg === "--output") {
      result.output = args[++i];
    } else if (arg === "--model" || arg === "-m") {
      result.model = args[++i];
    } else if (!arg.startsWith("-")) {
      result.prompt = arg;
    }
    i++;
  }

  return result;
}

async function generateImage(prompt, model, aspect) {
  console.log(`Generating image...`);
  console.log(`  Prompt: "${prompt}"`);
  console.log(`  Model: ${model}`);
  console.log(`  Aspect: ${aspect}`);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://alquimia-web-builder.local",
      "X-Title": "alquimIA Web Builder",
    },
    body: JSON.stringify({
      model: model,
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: `Generate an image: ${prompt}. Aspect ratio: ${aspect}. High quality, professional, suitable for web design.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error}`);
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message;

  if (!message) {
    throw new Error("No message in response");
  }

  // Check for images array (OpenRouter image generation format)
  if (message.images && Array.isArray(message.images)) {
    for (const img of message.images) {
      const url = img.image_url?.url || img.url;
      if (url && url.includes("base64")) {
        const base64 = url.split(",")[1];
        return Buffer.from(base64, "base64");
      }
    }
  }

  const content = message.content;

  if (!content) {
    throw new Error("No content in response");
  }

  // Check if response contains base64 image data in content string
  if (typeof content === "string" && content.includes("data:image")) {
    const match = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (match) {
      return Buffer.from(match[1], "base64");
    }
  }

  // Check if content is an array with image content
  if (Array.isArray(content)) {
    for (const item of content) {
      if (item.type === "image" || item.type === "image_url") {
        const imgData = item.image_url?.url || item.url || item.data;
        if (imgData && imgData.includes("base64")) {
          const base64 = imgData.split(",")[1];
          return Buffer.from(base64, "base64");
        }
      }
    }
  }

  // If we got text back instead of an image, report it
  console.log("Response (no image found):", typeof content === "string" ? content.slice(0, 500) : JSON.stringify(content).slice(0, 500));
  throw new Error("Model did not return an image. Try a different model or prompt.");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt) {
    console.log("Usage: node tools/generate_image.js <prompt> [options]");
    console.log("");
    console.log("Options:");
    console.log("  -o, --output <path>    Output file path (default: media/generated-image.png)");
    console.log("  -a, --aspect <ratio>   Aspect ratio (default: 16:9)");
    console.log("  -m, --model <model>    OpenRouter model ID");
    console.log("");
    console.log("Examples:");
    console.log('  node tools/generate_image.js "abstract dark gradient" -o media/hero-bg.png');
    console.log('  node tools/generate_image.js "modern laptop mockup" --aspect 16:9 -o media/mockup.png');
    process.exit(0);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(args.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const imageBuffer = await generateImage(args.prompt, args.model, args.aspect);
    fs.writeFileSync(args.output, imageBuffer);
    console.log(`Image saved: ${args.output}`);
  } catch (error) {
    console.error(`Failed: ${error.message}`);
    process.exit(1);
  }
}

main();
