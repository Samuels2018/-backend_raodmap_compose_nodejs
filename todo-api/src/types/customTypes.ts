import { User } from '..//models/userModel'; // Ajusta la ruta según tu estructura de proyecto

declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
      };
    }
  }
}

declare module 'express' {
  interface Request {
    user?: {
      id: number;
    };
  }
}