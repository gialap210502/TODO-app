//import mongoose to create new Schema
const mongoose = require('mongoose');

//create Schema
const TodoSchema = new mongoose.Schema({
    item:{
        type: String,
        required: true
    }
})

//export this Schema
module.exports = mongoose.model('todo', TodoSchema);