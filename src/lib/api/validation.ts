import { NextResponse } from 'next/server';
import { z } from 'zod';
import { badRequest } from '@/lib/api/errors';

interface ValidationSuccess<T> {
  success: true;
  data: T;
}

interface ValidationFailure {
  success: false;
  response: NextResponse;
}

type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ValidationResult<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { success: false, response: badRequest("Invalid JSON body") };
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      success: false,
      response: badRequest("Invalid request body", parsed.error.issues),
    };
  }

  return { success: true, data: parsed.data };
}

export function parseParams<T>(
  params: unknown,
  schema: z.ZodType<T>,
): ValidationResult<T> {
  const parsed = schema.safeParse(params);

  if (!parsed.success) {
    return {
      success: false,
      response: badRequest("Invalid route params", parsed.error.issues),
    };
  }

  return { success: true, data: parsed.data };
}

export function parseQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>,
): ValidationResult<T> {
  const queryObject = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(queryObject);

  if (!parsed.success) {
    return {
      success: false,
      response: badRequest("Invalid query params", parsed.error.issues),
    };
  }

  return { success: true, data: parsed.data };
}
