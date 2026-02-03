import { z } from 'zod';
import { badRequest } from '../api-response';

// Re-export all validation schemas
export * from './auth';
export * from './portfolio';
export * from './watchlist';
export * from './notes';

/**
 * Validates request body against a Zod schema
 * Returns the parsed data if valid, or throws a formatted error response
 */
export async function validateRequest<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(errors)) {
      if (value && Array.isArray(value)) {
        formattedErrors[key] = value as string[];
      }
    }

    throw badRequest('Validation failed', formattedErrors);
  }

  return result.data;
}

/**
 * Validates query parameters against a Zod schema
 */
export function validateQuery<T extends z.ZodSchema>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const result = schema.safeParse(params);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const formattedErrors: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(errors)) {
      if (value && Array.isArray(value)) {
        formattedErrors[key] = value as string[];
      }
    }

    throw badRequest('Invalid query parameters', formattedErrors);
  }

  return result.data;
}
