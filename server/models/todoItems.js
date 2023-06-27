const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const TodoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  item: {
    type: String,
    required: true
  },
  itemStatus: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Todo', TodoSchema);


