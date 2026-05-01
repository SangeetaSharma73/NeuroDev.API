import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app';

describe('Health Check E2E', () => {
  it('GET / should return "Api is working ..."', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Api is working ...');
  });

  it('GET /api/health should return status "Server is running"', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Server is running' });
  });
});

