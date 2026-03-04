import { describe, expect, it } from 'vitest';
import {
  PLAN_GATING_MATRIX,
  getPlanCapabilities,
  isPlusPlan,
  normalizePlan,
} from '@/lib/subscription/gating';

describe('subscription gating matrix', () => {
  it('normalizes unknown plans to FREE', () => {
    expect(normalizePlan(undefined)).toBe('FREE');
    expect(normalizePlan('PRO')).toBe('FREE');
  });

  it('detects PLUS correctly', () => {
    expect(isPlusPlan('PLUS')).toBe(true);
    expect(isPlusPlan('FREE')).toBe(false);
  });

  it('returns expected capabilities for each plan', () => {
    expect(getPlanCapabilities('FREE')).toEqual(PLAN_GATING_MATRIX.FREE);
    expect(getPlanCapabilities('PLUS')).toEqual(PLAN_GATING_MATRIX.PLUS);
  });
});
