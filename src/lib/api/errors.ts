import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'BAD_REQUEST'
  | 'INTERNAL_ERROR';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
) {
  return NextResponse.json<ApiErrorBody>(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status },
  );
}

export function unauthorized(message = 'Unauthorized') {
  return apiError(401, 'UNAUTHORIZED', message);
}

export function forbidden(message = 'Forbidden') {
  return apiError(403, 'FORBIDDEN', message);
}

export function notFound(message = 'Resource not found') {
  return apiError(404, 'NOT_FOUND', message);
}

export function conflict(message: string) {
  return apiError(409, 'CONFLICT', message);
}

export function badRequest(message: string, details?: unknown) {
  return apiError(400, 'BAD_REQUEST', message, details);
}

export function internalServerError(message = 'Internal server error') {
  return apiError(500, 'INTERNAL_ERROR', message);
}
