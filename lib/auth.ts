import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { config } from './config';

export interface JWTPayload {
  userId: string;
  username?: string;
  iat?: number;
  exp?: number;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Extracts and verifies the JWT token from the Authorization header
 * @returns The decoded JWT payload containing userId
 * @throws AuthError if token is missing, invalid, or expired
 */
export async function getUserIdFromToken(): Promise<string> {
  const headersList = await headers();
  const authorization = headersList.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Unauthorized - No valid authorization header');
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    if (!decoded.userId) {
      throw new AuthError('Invalid token payload');
    }

    return decoded.userId;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Invalid token');
    }
    throw error;
  }
}

/**
 * Verifies a JWT token without extracting from headers
 * Useful for manual token verification
 */
export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, config.jwt.secret) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Invalid token');
    }
    throw error;
  }
}

/**
 * Creates a new access token
 */
export function createAccessToken(payload: { userId: string; username: string }): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry,
  });
}

/**
 * Creates a new refresh token
 */
export function createRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiry,
  });
}

/**
 * Checks if the error is an AuthError
 */
export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
