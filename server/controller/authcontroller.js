const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require("jsonwebtoken");

let refreshTokens = [];
//verify token
const authcontroller = {
    // CREATE: Create a new user
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                username: req.body.username,
                password: hashed
            });

            const savedUser = await newUser.save();
            res.status(200).json(savedUser);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                name: user.username
            },
            process.env.secretkey,
            { expiresIn: "7s" }
        );
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                name: user.username
            },
            process.env.secretkeyrefresh,
            { expiresIn: "500s" }
        );
    },
    // Login
    Login: async (req, res) => {
        const { username, password } = req.body;

        try {
            // Tìm người dùng dựa trên tên đăng nhập
            const user = await User.findOne({ username });

            // Kiểm tra xem người dùng có tồn tại hay không
            if (!user) {
                return res.status(404).json({ message: 'Tên đăng nhập không hợp lệ' });
            }
            const validpass = await bcrypt.compare(
                password,
                user.password
            );
            if (!validpass) {
                return res.status(404).json({ message: 'Mật khẩu không đúng' });
            }
            // Lưu thông tin người dùng vào session
            if (user && validpass) {
                const accesstoken = authcontroller.generateAccessToken(user);
                const refreshToken = authcontroller.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                const { password, ...others } = user._doc;

                res.status(200).json({ ...others, accesstoken, refreshToken });
            }
            req.session.user = user;


        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    },
    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshToken = req.body.token;
        // console.log(req.body);
        //Send error if token is not valid
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        console.log(refreshTokens + ' TH1');
        if (!refreshToken.includes(refreshToken)) {// rf === rfs : true => false
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.secretkeyrefresh, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            //create new access token, refresh token and send to user
            const newAccessToken = authcontroller.generateAccessToken(user);
            const newRefreshToken = authcontroller.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            
            res.status(200).json({
                accesstoken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    },
    // READ: Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    //LOG OUT
    logOut: async (req, res) => {
        //Clear cookies when user logs out
        refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out successfully!");
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

};

// /////
// router.put('/api/users/:userId/items/:itemId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const itemId = req.params.itemId;

//         // Kiểm tra xem người dùng có tồn tại không
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Kiểm tra xem mục có tồn tại không
//         const item = await todoItemsModel.findById(itemId);
//         if (!item) {
//             return res.status(404).json({ message: 'Item not found' });
//         }

//         // Kiểm tra xem mục thuộc về người dùng hay không
//         if (item.user.toString() !== userId) {
//             return res.status(403).json({ message: 'Access denied' });
//         }

//         // Cập nhật thông tin của mục
//         item.item = req.body.item || item.item;
//         item.itemStatus = req.body.itemStatus || item.itemStatus;
//         const updatedItem = await item.save();
//         res.status(200).json(updatedItem);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });


// // DELETE: Delete an item for a specific user
// router.delete('/api/users/:userId/items/:itemId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const itemId = req.params.itemId;

//         // Kiểm tra xem người dùng có tồn tại không
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Kiểm tra xem mục có tồn tại không
//         const item = await todoItemsModel.findById(itemId);
//         if (!item) {
//             return res.status(404).json({ message: 'Item not found' });
//         }

//         // Kiểm tra xem mục thuộc về người dùng hay không
//         if (item.user.toString() !== userId) {
//             return res.status(403).json({ message: 'Access denied' });
//         }

//         // Xóa mục
//         await item.deleteOne();
//         res.status(200).json({ message: 'Item deleted successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // DELETE: Delete all items with itemStatus=true for a specific user
// router.delete('/api/users/:userId/items', async (req, res) => {
//     try {
//         const userId = req.params.userId;

//         // Kiểm tra xem người dùng có tồn tại không
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Xóa tất cả các mục có itemStatus=true và thuộc về người dùng
//         const filter = { user: userId, itemStatus: true };
//         const deleteResult = await todoItemsModel.deleteMany(filter);

//         res.status(200).json({ message: `${deleteResult.deletedCount} items deleted successfully` });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

//export router
module.exports = authcontroller;