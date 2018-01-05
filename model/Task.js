const mongoose = {Schema} = require("./db");

/* database schema for Task */
const taskSchema = new Schema({
    chat_id: {
        type: Number,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        stripHtmlTags: true,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

class Task {

}

taskSchema.loadClass(Task);

module.exports = mongoose.model("Task", taskSchema);