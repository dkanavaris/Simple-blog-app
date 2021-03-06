const createError = require('http-errors');
const express = require('express');
let path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
require('dotenv').config()

const usersRouter = require('./routes/users_router/user');
const loginRouter = require("./routes/login_router/login");
const signupRouter = require("./routes/signup_router/signup");
const mainPageRouter = require("./routes/main_page/blog_posts");
const dependencyInjection = require("./dependencyInjection");
const blogDB = require("./blogDB");

let db;
/* Connect to DB*/
if(process.env.TESTING == "false"){
  // const mongoDb = process.env.DB_URL;
  // mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
  // const db = mongoose.connection;
  // db.on("error", console.error.bind(console, "mongo connection error"));
  db = new blogDB(process.env.DB_URL);
  db.connect();

}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Inject a database dependencies.
app.use('/', dependencyInjection(db, "db"), loginRouter);
app.use('/signup', dependencyInjection(db, "db"), signupRouter)
app.use('/blog-posts', dependencyInjection(db, "db"), mainPageRouter);
app.use('/user', dependencyInjection(db, "db"), usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
