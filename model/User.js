const mongoose = {Schema} = require("./db");

const userSchema = new Schema({
    chat_id: {
        type: Number,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    language: {
        type: String,
    },
    last_activity: {
        type: Date,
        default: Date.now,
    },
    last_action_type: {
        type: String,
    },
    logs: [],
});

userSchema.statics.check = function(chat, callback) {
    const query = { chat_id: chat.id },
        update = { username: chat.username },
        options = {upsert: true, new: true, setDefaultsOnInsert: true};

    this.findOneAndUpdate(query, update, options, (error, user) => {
        if (error) return callback(error);
        callback(null, user);
    });
};

module.exports = mongoose.model("User", userSchema);