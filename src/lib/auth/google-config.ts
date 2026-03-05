const GOOGLE_REQUIRED_ENV_KEYS = ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"] as const;

const GOOGLE_PRODUCTION_RECOMMENDED_ENV_KEYS = [
  "AUTH_SECRET",
  "AUTH_TRUST_HOST",
  "NEXTAUTH_URL",
] as const;

function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function isGoogleOAuthEnabled() {
  return GOOGLE_REQUIRED_ENV_KEYS.every((key) => hasValue(process.env[key]));
}

export function getGoogleOAuthEnvReport() {
  const missingRequired = GOOGLE_REQUIRED_ENV_KEYS.filter(
    (key) => !hasValue(process.env[key]),
  );
  const missingProductionRecommended =
    GOOGLE_PRODUCTION_RECOMMENDED_ENV_KEYS.filter(
      (key) => !hasValue(process.env[key]),
    );

  return {
    enabled: missingRequired.length === 0,
    missingRequired,
    missingProductionRecommended,
  };
}

export const googleOAuthEnvKeys = {
  required: GOOGLE_REQUIRED_ENV_KEYS,
  productionRecommended: GOOGLE_PRODUCTION_RECOMMENDED_ENV_KEYS,
};
