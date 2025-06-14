import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AppError } from '../utils/appError';

interface DecodedToken {
  id: number;
  iat: number;
  exp: number;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1) Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }


    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
    console.log('Decoded token:', decoded);
    if (!decoded) {
      return next(new AppError('Invalid token', 401));
    }

    // 3) Check if user still exists (optional)
    // You can add this if you want to check if user still exists in DB

    // Add user ID to request object
    req.body = { id: decoded.id };

    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // This can be implemented if you have roles in your user model
    // For now, we'll just pass to next middleware
    next();
  };
};