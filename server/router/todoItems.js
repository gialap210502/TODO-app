const router = require("express").Router();
//import todo model
const todoItemsModel = require('../models/todoItems');
const User = require('../models/user');
const listController = require("../controller/listcontroller");
const midlewareVerify = require('../controller/verifyToken');




//all item
router.get('/api/users/:userId/items', listController.GetAllTodo);

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
router.delete('/api/item/:id',midlewareVerify.verifyTokenAndUserAuthorization,  async (req, res) => {
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


//export router
module.exports = router;