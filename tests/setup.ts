import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import * as dbHandler from './utils/dbHandler';

// 1. Set environment variables BEFORE any imports that might use them
process.env.NODE_ENV = 'test';
process.env.GOOGLE_CLIENT_ID = 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGO_URI = 'test-mongo-uri';

// 2. Global Mocks
vi.mock('@/config/passport', () => ({
  default: {
    use: vi.fn(),
    initialize: vi.fn(
      () =>
        (req: any, res: any, next: any): void =>
          next()
    ),
    authenticate: vi.fn(
      () =>
        (req: any, res: any, next: any): void =>
          next()
    ),
    session: vi.fn(
      () =>
        (req: any, res: any, next: any): void =>
          next()
    )
  }
}));

// 3. Lifecycle Hooks
beforeAll(async () => {
  await dbHandler.connect();
});

afterEach(async () => {
  await dbHandler.clearDatabase();
  vi.clearAllMocks();
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});
