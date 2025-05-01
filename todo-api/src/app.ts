import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth.routes';
import todoRouter from './routes/todo.routes';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/todos', todoRouter);

// Error handling middleware
app.use(errorHandler);

export default app;