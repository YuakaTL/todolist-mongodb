const mongoose = require('mongoose');

const todolistSchema = new mongoose.Schema(
    {
        "title": {
            type: String,
            required: [true, 'Title 未填寫']
        }
    }, { versionKey: false }
);
const Todo = mongoose.model('todolist', todolistSchema);

module.exports = Todo;