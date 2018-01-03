/**
 * Command to display welcome message and selecting language
 *
 * @param bot - Bot instance
 * @param i18n - i18n instance
 * @param [userStore] - Object containing active users
 * @returns {function(*, *)}
 */
module.exports = (bot, i18n, userStore = {}) => {

    const User = require("./../../model/User");
    const { sendLangKeyboard, sendActionsKeyboard } = require("./../utils/keyboards")(bot, i18n);

    return (msg, match) => {
        User.check(msg.chat, (error, user) => {
            if (error) return console.error(error);

            userStore[msg.username] = user;

            if (!user.language) {
                sendLangKeyboard(msg, `Hi, <b>${msg.chat.first_name}</b>. What language do you speak?`);
                return;
            }

            i18n.setLocale(user.language);

            sendActionsKeyboard(msg);
        });
    }
};