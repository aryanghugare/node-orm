import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import {loggerMiddleware} from './middlewares/logger.js';

import bookRouter from './routes/book.routes.js';

const app = express();
const PORT = 3000;

// Middlewares (Plugins)
app.use(express.json());
// app.use(loggerMiddleware);

// Routes
app.use('/books', bookRouter);

app.listen(PORT, () => console.log(`Http server is running on PORT ${PORT}`));
