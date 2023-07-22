const bcrypt = require('bcrypt');
const User = require('../models/todoItems');
const Todo = require('../models/user');
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const listcontroller = {
    // READ: Get all todo with a specific user by ID
    GetAllTodo: async (req, res) => {
        try {
            const userId = req.params.userId;

            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Lấy tất cả các mục liên quan đến người dùng
            const items = await todoItemsModel.find({ user: userId });
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
}

module.exports = listcontroller;

