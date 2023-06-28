const router = require('express').Router();
//import todo model
const todoItemsModel = require('../models/todoItems');
const User = require('../models/user');
const bcrypt = require('bcrypt');




//create route

//save item into database
router.post('/api/item', async (req, res) => {
    try {
        const newItem = new todoItemsModel({
            item: req.body.item,
            itemStatus: req.body.itemStatus
        })
        //save item to database
        const saveItem = await newItem.save()
        res.status(200).json(saveItem);

    } catch (error) {
        res.json(error);
    }
})


//get item from database
router.get('/api/items', async (req, res) => {
    try {
        const allTodoItems = await todoItemsModel.find({});
        res.status(200).json(allTodoItems)
    } catch (error) {
        res.json(error);
    }
})


//Update Items
router.put('/api/item/:id', async (req, res) => {
    try {
        //find by id
        const updateItem = await todoItemsModel.findByIdAndUpdate(req.params.id, { $set: req.body });
        res.status(200).json("Item update")
    } catch (error) {
        res.json(error);
    }
})

//Delete Items
router.delete('/api/item/:id', async (req, res) => {
    try {
        //find by id
        const updateItem = await todoItemsModel.findByIdAndDelete(req.params.id, { $set: req.body });
        res.status(200).json("Item deleted")
    } catch (error) {
        res.json(error);
    }
})

// Delete All Items with itemStatus true
router.delete('/api/items', async (req, res) => {
    try {
        const filter = { itemStatus: true };
        const deleteResult = await todoItemsModel.deleteMany(filter);
        res.status(200).json("All items with itemStatus true deleted");
    } catch (error) {
        res.json(error);
    }
});



//router for user
// CREATE: Create a new user
router.post('/api/users', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password
        });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// CREATE: Create a new user
router.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm người dùng dựa trên tên đăng nhập
        const user = await User.findOne({ username });

        // Kiểm tra xem người dùng có tồn tại hay không
        if (!user) {
            return res.status(404).json({ message: 'Tên đăng nhập không hợp lệ' });
        }

        if (password != user.password) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }

        // Đăng nhập thành công
        res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});
// READ: Get all users
router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// READ: Get a specific user by ID
router.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE: Update a specific user by ID
router.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                password: req.body.password
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE: Delete a specific user by ID
router.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



///
// CREATE: Create a new item for a specific user
router.post('/api/users/:userId/items', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tạo một mục mới cho người dùng
        const newItem = new todoItemsModel({
            user: userId,
            item: req.body.item,
            itemStatus: req.body.itemStatus
        });

        const savedItem = await newItem.save();
        res.status(200).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// READ: Get all todo with a specific user by ID
router.get('/api/users/:userId/items', async (req, res) => {
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
});

/////
router.put('/api/users/:userId/items/:itemId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.itemId;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra xem mục có tồn tại không
        const item = await todoItemsModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Kiểm tra xem mục thuộc về người dùng hay không
        if (item.user.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Cập nhật thông tin của mục
        item.item = req.body.item || item.item;
        item.itemStatus = req.body.itemStatus || item.itemStatus;
        const updatedItem = await item.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// DELETE: Delete an item for a specific user
router.delete('/api/users/:userId/items/:itemId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const itemId = req.params.itemId;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra xem mục có tồn tại không
        const item = await todoItemsModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Kiểm tra xem mục thuộc về người dùng hay không
        if (item.user.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Xóa mục
        await item.deleteOne();
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE: Delete all items with itemStatus=true for a specific user
router.delete('/api/users/:userId/items', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Xóa tất cả các mục có itemStatus=true và thuộc về người dùng
        const filter = { user: userId, itemStatus: true };
        const deleteResult = await todoItemsModel.deleteMany(filter);

        res.status(200).json({ message: `${deleteResult.deletedCount} items deleted successfully` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



//export router
module.exports = router;