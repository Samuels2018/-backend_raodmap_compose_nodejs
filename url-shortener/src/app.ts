import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import IndexUrl from './routes/index';
import Urls from './routes/urlRoutes';
import { errorHandler, notFoundHandler } from './utils/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', Urls);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;