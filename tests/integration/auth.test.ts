import { createUserProfile } from '@tests/factories/user.factory';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '@/app';

describe('Auth API Integration', () => {
  it('POST /api/auth/signup should create a new user and return a token', async () => {
    const userProfile = createUserProfile();

    const response = await request(app).post('/api/auth/signup').send(userProfile);

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    // Normalize email comparison if needed, but here we expect exact match or case-insensitive handled by logic
    expect(response.body.user.email).toBe(userProfile.email);
  });

  it('POST /api/auth/login should return a token for valid credentials', async () => {
    const userProfile = createUserProfile();
    // 1. Signup
    await request(app).post('/api/auth/signup').send(userProfile);

    // 2. Login
    const response = await request(app).post('/api/auth/login').send({
      email: userProfile.email,
      password: userProfile.password
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe(userProfile.email);
  });

  it('POST /api/auth/login should fail with nonexistent user', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBeDefined();
  });

  it('POST /api/auth/signup should fail if email already exists', async () => {
    const userProfile = createUserProfile();
    // 1. First signup
    await request(app).post('/api/auth/signup').send(userProfile);
    // 2. Second signup with same email
    const response = await request(app).post('/api/auth/signup').send(userProfile);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('User already exists');
  });

  it('POST /api/auth/login should fail with incorrect password', async () => {
    const userProfile = createUserProfile();
    // 1. Signup
    await request(app).post('/api/auth/signup').send(userProfile);
    // 2. Login with wrong password
    const response = await request(app).post('/api/auth/login').send({
      email: userProfile.email,
      password: 'wrong_password'
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Invalid Credentials');
  });
});

