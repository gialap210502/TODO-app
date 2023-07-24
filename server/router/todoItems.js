const router = require("express").Router();
//import todo model
const todoItemsModel = require('../models/todoItems');
const User = require('../models/user');
const listController = require("../controller/listcontroller");
const midlewareVerify = require('../controller/verifyToken');




//all item
router.get('/api/users/:userId/items', listController.GetAllTodo);

// CREATE: Create a new item for a specific user
router.post('/api/users/:userId/items',midlewareVerify.verifyTokenAndUserAuthorization, listController.createTask);

router.delete('/api/users/:userId/items', listController.deleteAllItemsWithItemStatusTrue)

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
router.delete('/api/users/:userId/items/:itemId',midlewareVerify.verifyTokenAndUserAuthorization,  async (req, res) => {
    try {
        //find by id
        const updateItem = await todoItemsModel.findByIdAndDelete(req.params.itemId, { $set: req.body });
        res.status(200).json("Item deleted")
    } catch (error) {
        res.json(error);
    }
})

// // Delete All Items with itemStatus true
// router.delete('/api/items', async (req, res) => {
//     try {
//         const filter = { itemStatus: true };
//         const deleteResult = await todoItemsModel.deleteMany(filter);
//         res.status(200).json("All items with itemStatus true deleted");
//     } catch (error) {
//         res.json(error);
//     }
// });
router.put('/api/users/:userId/items/:itemId', listController.updateItem);


//export router
module.exports = router;