const { CREATE_TASK } = require("./../contants/actions.const");

/**
 * Command to create new Task
 *
 * @param bot - Bot instance
 * @param i18n - i18n instance
 * @param [userStore] - Object containing active users
 * @returns {function(*, *)}
 */
module.exports = (bot, i18n, userStore = {}) => {
    return (msg, match) => {
        const chatId = msg.chat.id;

        userStore[chatId].action = CREATE_TASK;

        bot.sendMessage(chatId, i18n.__("Send task name"), {
            reply_markup: {hide_keyboard: true},
        });
    }
};