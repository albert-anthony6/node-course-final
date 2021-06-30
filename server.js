const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Global handler for uncaught promise exceptions (uncaught sync functions)
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! Shutting down...');
  process.exit(1);
});

const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection to DB successful.'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

// Global handler for unhandled promise rejections (unhandled async functions)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
