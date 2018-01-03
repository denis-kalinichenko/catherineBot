const mongoose = {Schema} = require("./db");

/* database schema for Task */
const taskSchema = new Schema({
    author: String,
});

module.exports = mongoose.model("Task", taskSchema);