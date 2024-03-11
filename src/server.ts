import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import cards from './routes/cards';
import archetypes from './routes/archetypes';
import errorHandler from './custom-middleware/error';
import { logger } from './middleware/logger';
import connectDB from './config/db';
import cors from 'cors';

const app = express();

//Load env variables
dotenv.config({ path: './env/config.env' });

//Connect to database
connectDB();

// Body parser
app.use(express.json());
app.use(cors());

//Dev logging middleware
//app.use(logger); /*Custom middleware */
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

//Mount Routes
app.use('/api/v1/cards', cards);
app.use('/api/v1/archetypes', archetypes);

//Custom Middleware Error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.PORT}`.yellow.bold)
);

// //Error section
process.on('unhandledRejection', (error: any, promise) => {
  console.log(`Unhanlded Rejection - Error : ${error.message}`.red.bold);
  //Close server
  server.close(() => process.exit(1));
});
