"use strict";

var express = require('express');

var mongoose = require('mongoose');

var dotenv = require('dotenv');

dotenv.config();

var cors = require('cors');

var session = require('express-session');

var cookieParser = require("cookie-parser"); // import router


var TodoItemRoute = require('./router/todoItems');

var Auth = require('./router/auth');

var app = express(); //use express.jon() to get data into json format

app.use(express.json());
app.use(cookieParser()); // Cấu hình session

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false
})); // // Đăng ký các middleware để xử lý đăng nhập và đăng ký
// app.use(express.urlencoded({ extended: true }));
//port

var PORT = process.env.PORT || 5500; //use cors

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000' // Replace with your frontend URL

})); //connect to mongoDB
//const db = "mongodb+srv://LapDZ:gialap123@cluster0.hxgrx.mongodb.net/?retryWrites=true&w=majority";

var db = process.env.DB;
mongoose.connect(db).then(function () {
  return console.log('Database connected');
})["catch"](function (err) {
  return console.log(err);
});
app.use('/', TodoItemRoute);
app.use('/', Auth); //Add Port and connect to server

app.listen(PORT, function () {
  return console.log("Server connected");
});