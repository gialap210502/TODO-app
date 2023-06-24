const router = require('express').Router();
//import todo model
const todoItemsModel =  require('../models/todoItems');

//create route
router.post('/api/item', async (req, res) => {
    try {
        const newItem = new todoItemsModel({
            item: req.body.item
        })
        //save item to database
        const saveItem = await newItem.save()
        res.status(200).json('Item add successfully');

    } catch (error) {
        res.json(error);
    }
})


//export router
module.exports = router;