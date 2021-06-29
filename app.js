const express = require('express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
// Adds the body content that's sent from the client to the req variable during post requests
app.use(express.json());

//Sub apps
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/tours', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
