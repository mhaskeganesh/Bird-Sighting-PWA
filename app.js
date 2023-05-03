const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const sightingPostFormRouter = require('./routes/sighting-post-form');
const insertrouter = require('./routes/api/insert');
const homePageRouter = require('./routes/homePageRouter');
const fetchPostsWithImageIdRouter = require('./routes/api/posts-with-images-ids');
const connectToDatabase = require('./config/dbConnect');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/get-posts', fetchPostsWithImageIdRouter);
app.use('/insert-post', insertrouter);
app.use('/sighting-post-form', sightingPostFormRouter);
app.use('/', homePageRouter);
// app.use('/', indexRouter);

// Start connection with database
const DB_OPTIONS = {
  dbName: 'bird-sighting',
};
// const { DATABASE_URL } = process.env;
const DATABASE_URL = 'mongodb://127.0.0.1:27017';
connectToDatabase(DATABASE_URL, DB_OPTIONS);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
