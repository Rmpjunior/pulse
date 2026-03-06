import { mkdirSync } from "node:fs";

const ENABLED = process.env.P6_AUTH_SMOKE_ENABLED === "true";
const BASE_URL = process.env.PULSE_BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.P6_AUTH_EMAIL;
const PASSWORD = process.env.P6_AUTH_PASSWORD;

if (!ENABLED) {
  console.log(
    "Smoke logado P6 desativado (defina P6_AUTH_SMOKE_ENABLED=true para ativar).",
  );
  process.exit(0);
}

if (!EMAIL || !PASSWORD) {
  console.error(
    "Smoke logado P6 ativado, mas credenciais ausentes. Defina P6_AUTH_EMAIL e P6_AUTH_PASSWORD no CI.",
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

  try {
    await Promise.all([
      page.waitForURL(/\/dashboard(\/|$)/, { timeout: 20000 }),
      page.click('button[type="submit"]'),
    ]);
  } catch {
    await page.screenshot({
      path: "p6-auth-smoke-artifacts/login-failure.png",
      fullPage: true,
    });
    throw new Error(
      "Falha no login do smoke P6. Verifique se P6_AUTH_EMAIL/P6_AUTH_PASSWORD estão válidos e se o usuário existe no ambiente alvo.",
    );
  }

  await page.screenshot({
    path: "p6-auth-smoke-artifacts/dashboard.png",
    fullPage: true,
  });

  await page.goto(`${BASE_URL}/dashboard/editor`, { waitUntil: "networkidle" });
  if (page.url().includes("/login")) {
    throw new Error(
      "Falha no smoke P6: /dashboard/editor redirecionou para /login. Credenciais inválidas, sessão não persistida ou proteção de rota com problema.",
    );
  }
  await page.screenshot({
    path: "p6-auth-smoke-artifacts/editor.png",
    fullPage: true,
  });

  await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: "networkidle" });
  if (page.url().includes("/login")) {
    throw new Error(
      "Falha no smoke P6: /dashboard/settings redirecionou para /login. Credenciais inválidas, sessão não persistida ou proteção de rota com problema.",
    );
  }
  await page.screenshot({
    path: "p6-auth-smoke-artifacts/settings.png",
    fullPage: true,
  });

  console.log("Smoke logado P6 concluído com sucesso.");
} finally {
  await browser.close();
}
