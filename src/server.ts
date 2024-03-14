import express from 'express';
import dotenv from 'dotenv';
import 'colors';
import mongoSanitize from 'express-mongo-sanitize';
//import { xss } from 'express-xss-sanitizer';
import helmet from 'helmet';
//import hpp from 'hpp';
//import limiter from './lib/rate-limit';
import cards from './routes/cards';
import archetypes from './routes/archetypes';
import errorHandler from './custom-middleware/error';
import { logger } from './middleware/logger';
import connectDB from './config/db';
import cors from 'cors';

const app = express();

//Load env variables
dotenv.config({ path: '../.env' });

connectDB(); //Connect to database
app.use(express.json()); // Body parser
app.use(cors()); // Body parser
app.use(helmet()); //Set security headers
app.use(mongoSanitize()); // Sanitize data
// app.use(hpp()); //Prevent http param pollution
// app.use(limiter); // Apply the rate limiting middleware to all requests.
// app.use(xss()); //Prvent XSS attacks

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

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.PORT}`.yellow.bold);
});

process.on('unhandledRejection', (error: any, promise) => {
  console.log(`Unhanlded Rejection - Error : ${error.message}`.red.bold);
  //Close server
  server.close(() => process.exit(1));
});
