import { chromium } from "playwright";
import fs from "fs";

const BASE = "http://localhost:3000";
const VIDEO_DIR = "scripts/.video";

const resume = `Jane Doe — Frontend Engineer

EXPERIENCE
Acme Corp — Frontend Developer (2021–2024)
- Built and maintained React web apps used by 50k+ monthly users.
- Implemented responsive, accessible UIs with HTML, CSS, JavaScript.

Startup XYZ — Junior Developer (2019–2021)
- Developed features in a jQuery + PHP codebase; wrote unit tests.

SKILLS
JavaScript, React, HTML, CSS, Git, REST APIs`;

const jobDescription = `Senior Frontend Engineer

Requirements:
- 5+ years building production web applications.
- Expert in React and TypeScript.
- Experience with Next.js and server-side rendering.
- Web performance and accessibility (WCAG).
- Automated testing (Jest, Playwright) and CI/CD on Vercel.`;

fs.rmSync(VIDEO_DIR, { recursive: true, force: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: "light",
  recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForSelector("text=Resume / JD Matcher");
await page.waitForTimeout(800);

// Type into the resume box (with a light delay so the GIF shows typing).
const resumeBox = page.getByPlaceholder("Paste your resume here…");
await resumeBox.click();
await resumeBox.type(resume, { delay: 4 });
await page.waitForTimeout(300);

const jdBox = page.getByPlaceholder("Paste the job posting here…");
await jdBox.click();
await jdBox.type(jobDescription, { delay: 4 });
await page.waitForTimeout(500);

// Analyze — shows the spinner, then results.
await page.getByRole("button", { name: /Analyze Match/i }).click();
await page.waitForSelector("text=Gaps", { timeout: 60000 });
await page.waitForSelector("text=Suggestions", { timeout: 60000 });
await page.waitForTimeout(700);

// Scroll through the results so the GIF reveals the whole panel.
await page.mouse.wheel(0, 500);
await page.waitForTimeout(900);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(900);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(1200);

await context.close();
await browser.close();

const file = fs.readdirSync(VIDEO_DIR).find((f) => f.endsWith(".webm"));
console.log("VIDEO:" + VIDEO_DIR + "/" + file);
