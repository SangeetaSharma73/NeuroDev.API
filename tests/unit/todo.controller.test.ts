import { Request, Response } from 'express';
import { beforeEach,describe, expect, it, vi } from 'vitest';

import * as todoController from '../../src/controllers/todo.controller';
import * as todoService from '../../src/services/todo.service';

// Mock the entire todo.service module
vi.mock('../../src/services/todo.service');

describe('Todo Controller Unit Tests', () => {
  const mockRequest = {} as Request;
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  } as unknown as Response;
  const mockNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should successfully create a todo and return 201', async () => {
      const mockTodo = { _id: '1', title: 'Test Todo' };
      mockRequest.body = { title: 'Test Todo' };

      vi.mocked(todoService.createTodo).mockResolvedValue(mockTodo as any);

      await todoController.createTodo(mockRequest, mockResponse, mockNext);

      expect(todoService.createTodo).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      const error = new Error('Service Error');
      vi.mocked(todoService.createTodo).mockRejectedValue(error);

      await todoController.createTodo(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTodo', () => {
    it('should return all todos with 200 status', async () => {
      const mockTodos = [{ _id: '1', title: 'Task 1' }];
      vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos as any);

      await todoController.getTodo(mockRequest, mockResponse, mockNext);

      expect(todoService.getTodos).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodos);
    });
  });

  describe('updateTodo', () => {
    it('should update and return the todo with 200 status', async () => {
      const mockTodo = { _id: '1', title: 'Updated Task', completed: true };

      mockRequest.params = { id: '1' };
      mockRequest.body = { title: 'Updated Task', completed: true };

      vi.mocked(todoService.updateTodo).mockResolvedValue(mockTodo as any);

      await todoController.updateTodo(mockRequest, mockResponse, mockNext);

      expect(todoService.updateTodo).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });
  });

  describe('getTodoById', () => {
    it('should return a specific todo with 200 status', async () => {
      const mockTodo = { _id: '1', title: 'Find Me' };
      mockRequest.params = { id: '1' };

      vi.mocked(todoService.getTodoById).mockResolvedValue(mockTodo as any);

      await todoController.getTodoById(mockRequest, mockResponse, mockNext);

      expect(todoService.getTodoById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return a message with 200 status', async () => {
      const mockTodo = { _id: '1', title: 'Delete Me' };
      mockRequest.params = { id: '1' };

      vi.mocked(todoService.deleteTodo).mockResolvedValue(mockTodo as any);

      await todoController.deleteTodo(mockRequest, mockResponse, mockNext);

      expect(todoService.deleteTodo).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Todo deleted', data: mockTodo });
    });
  });
});
