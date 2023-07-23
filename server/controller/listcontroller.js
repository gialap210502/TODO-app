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
    createTask: async (req, res) => {
        try {
            const userId = req.params.userId;
            // Tạo một mục mới cho người dùng
            const newItem = new todoItemsModel({
                user: userId,
                item: req.body.task.item,
                itemStatus: req.body.task.itemStatus
            });

            const savedItem = await newItem.save();
            res.status(200).json(savedItem);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    // DELETE: Delete all items with itemStatus=true for a specific user
    deleteAllItemsWithItemStatusTrue: async (req, res) => {
        try {
            const userId = req.params.userId;

            // Xóa tất cả các mục có itemStatus=true và thuộc về người dùng
            const filter = { user: userId, itemStatus: true };
            const deleteResult = await todoItemsModel.deleteMany(filter);

            res.status(200).json({ message: `${deleteResult.deletedCount} items deleted successfully` });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = listcontroller;

