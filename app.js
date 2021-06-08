const express = require('express');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
// Adds the body content that's sent from the client to the req variable during post requests
app.use(express.json());

//Sub apps
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/tours', userRouter);

module.exports = app;
