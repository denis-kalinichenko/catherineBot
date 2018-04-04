const mongoose = {Schema} = require("./db");

/* database schema for Task */
const taskSchema = new Schema({
    chat_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        stripHtmlTags: true,
    },
    done: {
        type: Boolean,
        default: false,
    },
    reminder: {
        type: Date,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

class Task {
    /**
     * Set status to done
     *
     * @param id - Task ID
     * @param callback
     */
    static setDone(id, callback) {
        const query = { _id: id };
        const update = { done: true };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        this.findOneAndUpdate(query, update, options, (error, task) => {
            if (error) return callback(error);
            callback(null, task);
        });
    }

    /**
     * Set status to TODO
     *
     * @param id - Task ID
     * @param callback
     */
    static setTodo(id, callback) {
        const query = { _id: id };
        const update = { done: false };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        this.findOneAndUpdate(query, update, options, (error, task) => {
            if (error) return callback(error);
            callback(null, task);
        });
    }
}

taskSchema.loadClass(Task);

module.exports = mongoose.model("Task", taskSchema);