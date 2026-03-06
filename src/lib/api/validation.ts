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
    return { success: false, response: badRequest("JSON inválido no corpo da requisição") };
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return {
      success: false,
      response: badRequest("Corpo da requisição inválido", parsed.error.issues),
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
      response: badRequest("Parâmetros de rota inválidos", parsed.error.issues),
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
      response: badRequest("Parâmetros de consulta inválidos", parsed.error.issues),
    };
  }

  return { success: true, data: parsed.data };
}
