import { mkdirSync } from "node:fs";

const ENABLED = process.env.P6_AUTH_SMOKE_ENABLED === "true";
const BASE_URL = process.env.PULSE_BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.P6_AUTH_EMAIL;
const PASSWORD = process.env.P6_AUTH_PASSWORD;

if (!ENABLED) {
  console.log("P6 auth UI smoke disabled (set P6_AUTH_SMOKE_ENABLED=true to enable).");
  process.exit(0);
}

if (!EMAIL || !PASSWORD) {
  console.error(
    "P6 auth UI smoke enabled but credentials are missing (P6_AUTH_EMAIL/P6_AUTH_PASSWORD).",
  );
  process.exit(1);
}

mkdirSync("p6-auth-smoke-artifacts", { recursive: true });

const { chromium } = await import("playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

try {
  await page.goto(`${BASE_URL}/pt-BR/login`, { waitUntil: "networkidle" });

  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);

  await Promise.all([
    page.waitForURL(/\/dashboard(\/|$)/, { timeout: 20000 }),
    page.click('button[type="submit"]'),
  ]);

  await page.screenshot({
    path: "p6-auth-smoke-artifacts/dashboard.png",
    fullPage: true,
  });

  await page.goto(`${BASE_URL}/dashboard/editor`, { waitUntil: "networkidle" });
  if (page.url().includes("/login")) {
    throw new Error("Auth smoke failed: /dashboard/editor redirected to /login");
  }
  await page.screenshot({
    path: "p6-auth-smoke-artifacts/editor.png",
    fullPage: true,
  });

  await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: "networkidle" });
  if (page.url().includes("/login")) {
    throw new Error("Auth smoke failed: /dashboard/settings redirected to /login");
  }
  await page.screenshot({
    path: "p6-auth-smoke-artifacts/settings.png",
    fullPage: true,
  });

  console.log("P6 auth UI smoke passed.");
} finally {
  await browser.close();
}
