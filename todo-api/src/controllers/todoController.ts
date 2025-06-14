import { Request, Response, NextFunction } from 'express';
import TodoService from '../services/todoService';
import { AppError } from '../utils/appError';

export const getAllTodos = async (req: Request, res: Response, next: NextFunction) => {

  const {id} = req.body.user;

  try {
    const result = await TodoService.getAllTodos(id, req.query);

    res.status(200).json({
      status: 'success',
      data: {
        todos: result.data,
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTodo = async (req: Request, res: Response, next: NextFunction) => {

  console.log('Request body:', req.body);
  const {user} = req.body;
  const {id} = user;

  try {
    const todo = await TodoService.getTodoById(parseInt(req.params.id), id);

    res.status(200).json({
      status: 'success',
      data: {
        todo,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { title, description, user } = req.body;
    const {id} = user;

    if (!title) {
      throw new AppError('Please provide title', 400);
    }

    const todo = await TodoService.createTodo(title, description, id);

    res.status(201).json({
      status: 'success',
      data: {
        todo,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { title, description, user } = req.body;
    const {id} = user;

    if (!title) {
      throw new AppError('Please provide title', 400);
    }

    const todo = await TodoService.updateTodo(
      parseInt(req.params.id),
      title,
      description,
      id
    );

    res.status(200).json({
      status: 'success',
      data: {
        todo,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {

  const {user} = req.body;
  const {id} = user;
  try {
    await TodoService.deleteTodo(parseInt(req.params.id), id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};