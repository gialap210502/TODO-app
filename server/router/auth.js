
const authController = require("../controller/authcontroller");
const router = require("express").Router();
const verifyToken = require("../controller/verifyToken");

// CREATE: Create a new user
router.post('/api/users/register', authController.registerUser);
// Login
router.post('/api/users/login', authController.Login);
router.post('/api/users/refresh', authController.requestRefreshToken);
// READ: Get all task
router.get('/api/users', verifyToken.verifyToken, authController.getAllUsers);
//logout
router.post('/api/users/logout', authController.logOut);


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
router.delete('/api/users/:id', authController.deleteUser);



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