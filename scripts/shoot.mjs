import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const OUT = "public/screenshots";

const resume = `Jane Doe
Frontend Engineer

EXPERIENCE
Acme Corp — Frontend Developer (2021–2024)
- Built and maintained React web apps used by 50k+ monthly users.
- Implemented responsive UIs with HTML, CSS, and JavaScript.
- Collaborated with designers to ship accessible components.

Startup XYZ — Junior Developer (2019–2021)
- Developed features in a jQuery + PHP codebase.
- Wrote unit tests and fixed bugs.

SKILLS
JavaScript, React, HTML, CSS, Git, REST APIs

EDUCATION
B.Sc. Computer Science — State University (2019)`;

const jobDescription = `Senior Frontend Engineer

We are looking for a Senior Frontend Engineer to join our product team.

Requirements:
- 5+ years building production web applications.
- Expert in React and TypeScript.
- Experience with Next.js and server-side rendering.
- Strong understanding of web performance and accessibility (WCAG).
- Experience with automated testing (Jest, Playwright).
- Familiarity with CI/CD pipelines and cloud deployment (AWS or Vercel).

Nice to have:
- GraphQL experience.
- Experience mentoring junior engineers.`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "light",
});

// 1. Empty state
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForSelector("text=Resume / JD Matcher");
await page.screenshot({ path: `${OUT}/01-home.png`, fullPage: true });
console.log("captured home");

// 2. Fill the form
await page.getByPlaceholder("Paste your resume here…").fill(resume);
await page.getByPlaceholder("Paste the job posting here…").fill(jobDescription);
await page.screenshot({ path: `${OUT}/02-filled.png`, fullPage: true });
console.log("captured filled");

// 3. Run the analysis and wait for results
await page.getByRole("button", { name: /Analyze Match/i }).click();
await page.waitForSelector("text=Gaps", { timeout: 60000 });
await page.waitForSelector("text=Suggestions", { timeout: 60000 });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/03-results.png`, fullPage: true });
console.log("captured results");

await browser.close();
console.log("done");
