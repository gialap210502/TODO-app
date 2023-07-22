const bcrypt = require('bcrypt');
const Todo = require('../models/user');
const jwt = require("jsonwebtoken");
const todoItemsModel = require('../models/todoItems');

let refreshTokens = [];

const listcontroller = {
    // READ: Get all todo with a specific user by ID
    GetAllTodo: async (req, res) => {
        try {
            const userId = req.params.userId;
            // Lấy tất cả các mục liên quan đến người dùng
            const items = await todoItemsModel.find({ user: userId });
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
}

module.exports = listcontroller;

