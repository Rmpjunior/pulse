export type SubscriptionPlan = 'FREE' | 'PLUS';

export interface PlanCapabilities {
  maxSections: number;
  customColors: boolean;
  premiumThemes: boolean;
  watermarkRemoval: boolean;
  analyticsDays: number;
}

export const PLAN_GATING_MATRIX: Record<SubscriptionPlan, PlanCapabilities> = {
  FREE: {
    maxSections: 8,
    customColors: false,
    premiumThemes: false,
    watermarkRemoval: false,
    analyticsDays: 30,
  },
  PLUS: {
    maxSections: 40,
    customColors: true,
    premiumThemes: true,
    watermarkRemoval: true,
    analyticsDays: 365,
  },
};

export function normalizePlan(plan?: string | null): SubscriptionPlan {
  return plan === 'PLUS' || plan === 'PLUS_MONTHLY' || plan === 'PLUS_ANNUAL'
    ? 'PLUS'
    : 'FREE';
}

export function getPlanCapabilities(plan?: string | null): PlanCapabilities {
  return PLAN_GATING_MATRIX[normalizePlan(plan)];
}

export function isPlusPlan(plan?: string | null): boolean {
  return normalizePlan(plan) === 'PLUS';
}
