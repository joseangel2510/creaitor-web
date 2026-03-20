# CLAUDE.md — AI-Powered Web Development Pipeline

> **Setup:** Windows + VS Code + Claude Code + Node.js
> **Copy this file + the entire template folder to start every new web project.**

## Always Do First

1. **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
2. **Read this entire file** before starting any task. Follow the pipeline in order.

---

## Pipeline Overview

This project uses a 4-step AI-powered design-to-development pipeline:

| Step | Tool | Purpose | Required? |
|------|------|---------|-----------|
| 1 | **ui-ux-pro-max** skill | Generate a complete design system | **Always** |
| 2 | **Google Stitch** MCP | Generate UI screens from prompts | Optional |
| 3 | **21st.dev Magic MCP** | Pull pre-built animated components | Optional |
| 4 | **OpenRouter Image Gen** | Generate images and visual assets | Optional |

Steps 2-4 enhance quality and speed but are **not blockers**. The core flow is always:
Design System → Build → Screenshot → Iterate.

---

## Step 0 — Project Setup

Every new project starts by copying the template folder. The structure is:

```
project-name/
├── CLAUDE.md              ← This file
├── .env                   ← API keys (copy from .env.example)
├── .env.example           ← Template for API keys
├── .gitignore
├── package.json
├── serve.mjs              ← Local dev server (port 3000)
├── screenshot.mjs         ← Puppeteer screenshot tool
├── index.html             ← Main output (created during build)
├── design-system.md       ← Generated in Step 1
├── brand_assets/          ← Client logos, colors, style guides (you fill this)
├── media/                 ← Generated images (Step 4)
├── tools/
│   └── generate_image.js  ← OpenRouter image generation
└── temporary screenshots/ ← Screenshot comparison files
```

After copying, run:
```bash
npm install
```

Then create `.env` from `.env.example` and add your API keys.

---

## Step 1 — Design System (ui-ux-pro-max)

Before writing any code, generate a complete design system.

**How to trigger:** Ask Claude:
> "Generate a design system for [project type/description]"

The design system must include:
- Color palette (primary, secondary, accent, neutrals, semantic)
- Typography (font pairing: display/serif for headings + clean sans for body)
- Spacing tokens (consistent scale)
- Component styles (buttons, cards, modals, inputs)
- Animation guidelines (easing curves, durations, stagger delays)
- Surface/depth system (base → elevated → floating layers)

**Output:** Save as `design-system.md` in project root. This is the visual bible — everything references it.

**Important:** If `brand_assets/` has client colors, logos, or style guides, those override the generated design system.

---

## Step 2 — UI Screens (Google Stitch MCP) [Optional]

Use Google Stitch to generate full UI screens. Always pass the design system as context.

**Available MCP tools:**

| Tool | Use |
|------|-----|
| `generate_screen_from_text` | Generate a UI screen from a prompt |
| `fetch_screen_code` | Download HTML/CSS of a generated screen |
| `fetch_screen_image` | Get a screenshot preview |
| `extract_design_context` | Extract "Design DNA" for consistency |
| `list_projects` / `list_screens` | Browse Stitch workspace |

**Workflow:**
1. Run `extract_design_context` first if working with an existing design
2. Generate screens with `generate_screen_from_text`, referencing the design system
3. Fetch code with `fetch_screen_code`
4. **Adapt** the code to match project tokens — never use Stitch output as-is

**Skip this step** if Stitch MCP is not configured. Proceed to Step 3 or Step 5.

---

## Step 3 — Components (21st.dev Magic MCP) [Optional]

Pull pre-built animated components before coding common sections from scratch.

**Common components:** Hero sections, navbars, footers, pricing tables, feature grids, testimonial carousels, FAQ accordions, animated modals, CTA sections, stats counters.

**Install a component:**
```bash
npx shadcn@latest add "https://21st.dev/r/component-name"
```

**Rules:**
- Check if a pre-built component exists before coding from scratch
- Always customize to match the design system
- Prefer components with built-in animations

**Skip this step** if 21st.dev MCP is not configured.

---

## Step 4 — Image Assets (OpenRouter) [Optional]

Generate images using the included Node.js script.

**Usage:**
```bash
node tools/generate_image.js "prompt" --aspect 16:9 -o media/hero-bg.png
node tools/generate_image.js "modern laptop mockup" --aspect 16:9 -o media/mockup.png
node tools/generate_image.js "minimalist icon rocket" --aspect 1:1 -o media/icon.png
```

**Rules:**
- Save all images to `media/`
- Use descriptive filenames: `hero-bg.png`, `feature-illustration-1.png`
- Requires `OPENROUTER_API_KEY` in `.env`

**Skip this step** if OpenRouter is not configured. Use `https://placehold.co/WIDTHxHEIGHT` as placeholder.

---

## Step 5 — Build

With the design system (and optionally Stitch screens, 21st.dev components, and generated assets), build the `index.html`.

**Apply all Anti-Generic Design Rules** (see section below).

**Must include:**
- Scroll-triggered animations on every section
- Hover/focus/active states on every clickable element
- Responsive design (mobile-first)
- Proper font pairing from the design system
- Layered depth system (base → elevated → floating)

---

## Step 6 — Screenshot, Compare, Iterate

**Start the server:**
```bash
npm run dev
# or: node serve.mjs
```

**Take a screenshot:**
```bash
npm run screenshot
# or: node screenshot.mjs http://localhost:3000
# with label: node screenshot.mjs http://localhost:3000 hero-v2
```

Screenshots auto-save to `temporary screenshots/screenshot-N.png`.

**Compare against:**
- The reference image (if client provided one) — match layout, spacing, typography, colors exactly
- The design system (if no reference) — verify tokens are applied correctly

**Be specific when comparing:** "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"

**Check:** spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing.

**Minimum 2 comparison rounds** before delivering. Stop only when no visible differences remain.

---

## Step 7 — Deliver

Package and deliver to client. Done.

---

## Reference Images

- If a reference image is provided: **match layout, spacing, typography, and color exactly**. Use placeholders for content. Do NOT improve or add to the design.
- If no reference image: design from scratch following the pipeline with high craft.

---

## Output Defaults

- Single `index.html` file, all styles inline, unless stated otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive
- All animations use `transform` and `opacity` only

---

## Tech Stack Options

### Static HTML (Default)
- HTML + CSS + Vanilla JavaScript
- Tailwind via CDN
- No build step

### React + Tailwind (Complex projects)
```bash
npx create-next-app@latest my-site --typescript --tailwind
cd my-site
npm install framer-motion
```

### Astro (Fast static sites)
```bash
npm create astro@latest my-site
cd my-site
npx astro add tailwind
npx astro add react
```

Use Static HTML unless the project specifically requires a framework.

---

## Animation Toolkit

### CSS Animations (Always available — copy into project)

```css
/* Fade in on scroll */
.animate-fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Float effect */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float { animation: float 3s ease-in-out infinite; }

/* Slide in from left */
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-left { animation: slide-in-left 0.8s ease forwards; }

/* Slide in from right */
@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-right { animation: slide-in-right 0.8s ease forwards; }

/* Scale up */
@keyframes scale-up {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-up { animation: scale-up 0.6s ease forwards; }

/* Gradient shift */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}

/* Stagger children */
.stagger > *:nth-child(1) { animation-delay: 0.1s; }
.stagger > *:nth-child(2) { animation-delay: 0.2s; }
.stagger > *:nth-child(3) { animation-delay: 0.3s; }
.stagger > *:nth-child(4) { animation-delay: 0.4s; }
.stagger > *:nth-child(5) { animation-delay: 0.5s; }
```

### Scroll-Triggered Animations (Vanilla JS)

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale-up'
).forEach(el => observer.observe(el));
```

### Libraries (Install as needed)

| Library | Install | Best For |
|---------|---------|----------|
| Framer Motion | `npm install framer-motion` | React projects |
| GSAP | `npm install gsap` | Complex timelines |
| AOS | `npm install aos` | Simple scroll animations |
| Lottie | `npm install lottie-web` | Vector animations |

---

## Common Animated Sections

| Section | Animation |
|---------|-----------|
| Hero | Fade-in text + floating elements + gradient background |
| Features | Staggered card fade-ins on scroll |
| Testimonials | Slide-in carousel |
| Pricing | Scale-up cards on scroll |
| CTA | Pulsing button + parallax background |
| Footer | Subtle fade-in links |
| Navbar | Blur backdrop + shrink on scroll |
| Stats | Count-up numbers on scroll |

---

## Anti-Generic Design Rules (MANDATORY)

### Colors
- **NEVER** use default Tailwind palette (indigo-500, blue-600, etc.)
- Pick a custom brand color and derive shades from it
- Dominant colors with sharp accents > evenly-distributed palettes

### Typography
- **NEVER** use the same font for headings and body
- **NEVER** use generic fonts: Inter, Roboto, Arial, system fonts
- Pair a display/serif font with a clean sans-serif
- Tight tracking (`-0.03em`) on large headings
- Generous line-height (`1.7`) on body text

### Shadows
- **NEVER** use flat `shadow-md`
- Layered, color-tinted shadows with low opacity

### Gradients
- Layer multiple radial gradients
- Add grain/texture via SVG noise filter

### Animations
- Only animate `transform` and `opacity`
- **NEVER** use `transition-all`
- Spring-style easing curves

### Interactive States
- Every clickable element needs `hover`, `focus-visible`, and `active` states

### Images
- Gradient overlay (`bg-gradient-to-t from-black/60`)
- Color treatment layer with `mix-blend-multiply`

### Spacing
- Consistent spacing tokens, not random Tailwind steps

### Depth
- Surface layering: base → elevated → floating

### Backgrounds
- Atmosphere and depth, never plain solid colors
- Gradient meshes, noise textures, geometric patterns

---

## Hard Rules

- Do **NOT** add sections/features/content not in the reference
- Do **NOT** "improve" a reference design — match it
- Do **NOT** stop after one screenshot pass (minimum 2 rounds)
- Do **NOT** use `transition-all`
- Do **NOT** use default Tailwind blue/indigo as primary
- Do **NOT** use generic AI aesthetics (purple gradients on white, cookie-cutter layouts)
- **DO** follow the pipeline for every new project
- **DO** save the design system before writing code
- **DO** check `brand_assets/` before designing
- **DO** add scroll-triggered animations on every page

---

## MCP Server Configuration

Add these to Claude Code MCP settings if available:

### Google Stitch
```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "stitch-mcp"],
      "env": {
        "STITCH_API_KEY": "YOUR_STITCH_API_KEY"
      }
    }
  }
}
```

### 21st.dev Magic MCP
```json
{
  "mcpServers": {
    "21st-magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic-mcp"]
    }
  }
}
```

---

## Quick Start Checklist

Every new project:

1. [ ] Copy template folder → rename to project name
2. [ ] `npm install`
3. [ ] Create `.env` from `.env.example` with your API keys
4. [ ] Add client assets to `brand_assets/`
5. [ ] Step 1: Generate design system → save as `design-system.md`
6. [ ] Step 2: Generate UI screens with Stitch (if configured)
7. [ ] Step 3: Pull 21st.dev components (if configured)
8. [ ] Step 4: Generate image assets (if configured)
9. [ ] Step 5: Build `index.html`
10. [ ] Step 6: `npm run dev` → `npm run screenshot` → compare → iterate (2+ rounds)
11. [ ] Step 7: Deliver
