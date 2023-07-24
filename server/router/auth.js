
const authController = require("../controller/authcontroller");
const listController = require("../controller/listcontroller");
const router = require("express").Router();
const verifyToken = require("../controller/verifyToken");

// CREATE: Create a new user
router.post('/api/users/register', authController.registerUser);
// Login
router.post('/api/users/login', authController.Login);
router.post('/api/users/refresh', authController.requestRefreshToken);
// READ: Get all task
router.get('/api/users', authController.getAllUsers);
//logout
router.post('/api/users/logout', verifyToken.verifyToken, authController.logOut);
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