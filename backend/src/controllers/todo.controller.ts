import { Request, Response, NextFunction } from 'express';
import * as todoService from '../services/todo.service';
// import { todo } from 'node:test';

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
};

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todos = await todoService.getTodos();
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await todoService.updateTodo(
      req.params.id as string,
      req.body
    );
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const getTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await todoService.getTodoById(req.params.id as string);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await todoService.deleteTodo(req.params.id as string);

    res.status(200).json({ message: 'Todo deleted', data: todo });
  } catch (err) {
    next(err);
  }
};
