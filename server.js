const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
  console.log('unhandled Exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB SUCCESS');
  });
// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('App Running on Port 3000');
});
process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
