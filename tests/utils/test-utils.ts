import type { Express } from 'express';
import request from 'supertest';

import { generateToken } from '@/utils/generateToken';

// Generates an Authorization header with a valid JWT for the given user ID.

export const getAuthHeader = (userId: string): { Authorization: string } => ({
  Authorization: `Bearer ${generateToken(userId)}`
});

//A wrapper around supertest to simplify authenticated requests in integration tests.

export const authenticatedRequest = (
  app: Express,
  userId: string
): {
  get: (url: string) => request.Test;
  post: (url: string) => request.Test;
  put: (url: string) => request.Test;
  delete: (url: string) => request.Test;
  patch: (url: string) => request.Test;
} => {
  const authHeader = getAuthHeader(userId);

  return {
    get: (url: string) => request(app).get(url).set(authHeader),
    post: (url: string) => request(app).post(url).set(authHeader),
    put: (url: string) => request(app).put(url).set(authHeader),
    delete: (url: string) => request(app).delete(url).set(authHeader),
    patch: (url: string) => request(app).patch(url).set(authHeader)
  };
};

