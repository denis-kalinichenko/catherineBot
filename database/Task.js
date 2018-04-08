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
     */
    static setDone(id) {
        const update = { done: true };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        return this.findByIdAndUpdate(id, update, options).exec();
    }

    /**
     * Set status to TO DO
     *
     * @param id - Task ID
     */
    static setTodo(id) {
        const update = { done: false };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        return this.findByIdAndUpdate(id, update, options).exec();
    }

    /**
     * Set reminder
     *
     * @param id - Task ID
     * @param date - Date
     */
    static setReminder(id, date) {
        const update = { reminder: date };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        return this.findByIdAndUpdate(id, update, options).exec();
    }

    /**
     * Unset reminder
     *
     * @param id - Task ID
     */
    static unsetReminder(id) {
        const update = { reminder: null };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        return this.findByIdAndUpdate(id, update, options).exec();
    }
}

taskSchema.loadClass(Task);

module.exports = mongoose.model("Task", taskSchema);