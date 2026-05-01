import { createTestTodo, createTodoProfile } from '@tests/factories/todo.factory';
import { createTestUser } from '@tests/factories/user.factory';
import { authenticatedRequest } from '@tests/utils/test-utils';
import { describe, expect, it } from 'vitest';

import app from '@/app';

describe('Todo API Integration', () => {
  it('POST /api/todos should create a new todo', async () => {
    // Generate valid data using factory
    const user = await createTestUser();
    const todoData = createTodoProfile();

    // Perform authenticated request (helper handles token & supertest)
    const response = await authenticatedRequest(app, user._id.toString())
      .post('/api/todos')
      .send(todoData);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(todoData.title);
    expect(response.body.priority).toBe(todoData.priority);
  });

  it('GET /api/todos should return all todos of the database', async () => {
    const user = await createTestUser();

    // Seed database with multiple todos
    await createTestTodo();
    await createTestTodo();

    const response = await authenticatedRequest(app, user._id.toString()).get('/api/todos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });
});

