import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import { AppError } from '../utils/appError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError('Please provide name, email and password', 400);
    }

    const { token } = await AuthService.register(name, email, password);

    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const { token } = await AuthService.login(email, password);

    console.log('Token generated:', token);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
};