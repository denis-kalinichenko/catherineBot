/**
 * Command to change the language
 *
 * @param bot - Bot instance
 * @param i18n - i18n instance
 * @param [userStore] - Object containing active users
 * @returns {function(*, *)}
 */
module.exports = (bot, i18n, userStore = {}) => {

    const User = require("../../database/User");
    const { sendLangKeyboard, sendActionsKeyboard } = require("./../utils/keyboards")(bot, i18n);

    return (msg, match) => {
        const chatId = msg.chat.id;
        const body = match[1].toLowerCase();
        let lang;

        if (body.includes("en")) {
            lang = "en";
        }

        if (body.includes("ру")) {
            lang = "ru";
        }

        if (body.includes("pol")) {
            lang = "pl";
        }

        if (!lang) {
            return sendLangKeyboard(msg);
        }

        User.findOneAndUpdate({ chat_id: chatId }, { language: lang }, (error, user) => {
            if (error) return console.error(error);

            userStore[msg.username] = user;

            i18n.setLocale(lang);

            bot.sendMessage(chatId, i18n.__("Language selected"), {
                reply_markup: {hide_keyboard: true},
            });

            return sendActionsKeyboard(msg);
        });
    }
};