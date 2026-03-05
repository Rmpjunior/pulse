import { afterEach, describe, expect, it } from "vitest";
import {
  getGoogleOAuthEnvReport,
  isGoogleOAuthEnabled,
} from "./google-config";

const ENV_KEYS = [
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "AUTH_SECRET",
  "AUTH_TRUST_HOST",
  "NEXTAUTH_URL",
] as const;

const original = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof ENV_KEYS)[number], string | undefined>;

function resetEnv() {
  for (const key of ENV_KEYS) {
    if (original[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original[key];
    }
  }
}

afterEach(() => {
  resetEnv();
});

describe("google auth config", () => {
  it("desabilita Google OAuth quando faltam credenciais", () => {
    delete process.env.AUTH_GOOGLE_ID;
    delete process.env.AUTH_GOOGLE_SECRET;

    expect(isGoogleOAuthEnabled()).toBe(false);

    const report = getGoogleOAuthEnvReport();
    expect(report.enabled).toBe(false);
    expect(report.missingRequired).toEqual([
      "AUTH_GOOGLE_ID",
      "AUTH_GOOGLE_SECRET",
    ]);
  });

  it("habilita Google OAuth quando credenciais obrigatórias existem", () => {
    process.env.AUTH_GOOGLE_ID = "google-client";
    process.env.AUTH_GOOGLE_SECRET = "google-secret";

    expect(isGoogleOAuthEnabled()).toBe(true);

    const report = getGoogleOAuthEnvReport();
    expect(report.enabled).toBe(true);
    expect(report.missingRequired).toEqual([]);
    expect(report.missingProductionRecommended).toContain("AUTH_SECRET");
  });
});
