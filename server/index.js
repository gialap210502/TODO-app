const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');

const app = express();
//use express.jon() to get data into json format
app.use(express.json());


// Cấu hình session
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Đăng ký các middleware để xử lý đăng nhập và đăng ký
app.use(express.urlencoded({ extended: true }));
//port
const PORT = process.env.PORT || 5500;

//use cors
app.use(cors());

// import router
const TodoItemRoute = require('./router/todoItems');

//connect to mongoDB
const db = "mongodb+srv://LapDZ:gialap123@cluster0.hxgrx.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(db)
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err))



app.use('/', TodoItemRoute);

//Add Port and connect to server
app.listen(PORT, () => console.log("Server connected"));

