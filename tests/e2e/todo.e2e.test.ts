import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import app from '../../src/app';
import Todo from '../../src/models/todo.model';
import User from '../../src/models/user.model';
import { getAuthHeader } from '../utils/test-utils';

describe('Todo E2E Tests', () => {
  const baseUrl = '/api/todos';
  let authHeader: { Authorization: string };

  beforeAll(async () => {
    const user = await User.create({
      name: 'E2E User',
      email: 'e2e@example.com',
      password: 'password123'
    });
    authHeader = getAuthHeader(user._id.toString());
  });

  it('should create a new todo', async () => {
    const newTodo = {
      title: 'Setup E2E testing',
      description: 'Implement supertest and mongo-memory-server',
      priority: 'medium'
    };

    const response = await request(app).post(baseUrl).set(authHeader).send(newTodo);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body._id).toBeDefined();

    const savedTodo = await Todo.findById(response.body._id);
    expect(savedTodo).not.toBeNull();
  });

  it('should get all todos', async () => {
    await Todo.create({ title: 'Task 1', priority: 'low' });
    const response = await request(app).get(baseUrl).set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a todo by ID', async () => {
    const todo = await Todo.create({ title: 'Important Task', priority: 'hard' });
    const response = await request(app).get(`${baseUrl}/${todo._id}`).set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Important Task');
  });

  it('should update a todo', async () => {
    const todo = await Todo.create({ title: 'Update Me', priority: 'low' });
    const response = await request(app)
      .put(`${baseUrl}/${todo._id}`)
      .set(authHeader)
      .send({ title: 'Updated Task', completed: true, priority: 'hard' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Task');
  });

  it('should delete a todo', async () => {
    const todo = await Todo.create({ title: 'Delete Me', priority: 'low' });
    const response = await request(app).delete(`${baseUrl}/${todo._id}`).set(authHeader);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todo deleted');
  });
});
