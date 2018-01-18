const mongoose = {Schema} = require("./db");

/* database schema for User */
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
});

class User {
    /**
     * registering new user if doesn't exists, updating data and returning full info
     *
     * @param chat
     * @param callback
     */
    static check(chat, callback) {
        const query = { chat_id: chat.id };
        const update = { username: chat.username };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        this.findOneAndUpdate(query, update, options, (error, user) => {
            if (error) return callback(error);
            callback(null, user);
        });
    }
}

userSchema.loadClass(User);

module.exports = mongoose.model("User", userSchema);