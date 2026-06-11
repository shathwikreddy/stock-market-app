import { NextResponse } from 'next/server';
import { AuthError } from './auth';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a successful API response
 */
export function successResponse<T>(
  data: T,
  options?: {
    message?: string;
    status?: number;
    additionalFields?: Record<string, unknown>;
  }
): NextResponse<ApiSuccessResponse<T>> {
  const { message, status = 200, additionalFields = {} } = options || {};

  return NextResponse.json(
    {
      success: true as const,
      ...(message && { message }),
      data,
      ...additionalFields,
    },
    { status }
  );
}

/**
 * Creates an error API response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  errors?: Record<string, string[]>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      message,
      ...(errors && { errors }),
    },
    { status }
  );
}

/**
 * Handles errors and returns appropriate API responses
 * Automatically handles AuthError with correct status codes
 */
export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof AuthError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof Error) {
    // In production, you might want to log the actual error
    // and return a generic message
    return errorResponse(error.message, 500);
  }

  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Creates a 400 Bad Request response
 */
export function badRequest(message: string, errors?: Record<string, string[]>): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 400, errors);
}

/**
 * Creates a 401 Unauthorized response
 */
export function unauthorized(message: string = 'Unauthorized'): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 401);
}

/**
 * Creates a 404 Not Found response
 */
export function notFound(message: string = 'Resource not found'): NextResponse<ApiErrorResponse> {
  return errorResponse(message, 404);
}

/**
 * Creates a 201 Created response
 */
export function created<T>(
  data: T,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, { message, status: 201 });
}
