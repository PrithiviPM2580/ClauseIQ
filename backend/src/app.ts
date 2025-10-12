import express, { type Express } from 'express';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import corsOptions from '@/lib/cors.lib';
import compressionMiddleware from '@/middleware/compression.middleware';
import logger from '@/lib/logger.lib';
import globalErrorHandler from '@/middleware/globalErrorHandler.middleware';
import routes from '@/routes/index.route';
const app: Express = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(compressionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.use(routes);

app.use(globalErrorHandler);

export default app;
