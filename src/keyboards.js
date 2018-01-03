module.exports = (bot, i18n) => {

    /* send keyboard to choose language */
    const sendLangKeyboard = (msg, reply = "Choose language") => {
        const message_options = {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [["/lang English 🇺🇸"], ["/lang Русский 🇷🇺"], ["/lang Polski 🇵🇱"]],
            }
        };
        bot.sendMessage(msg.chat.id, reply, message_options);
    };

    /* send keyboard to choose actions */
    const sendActionsKeyboard = (msg) => {
        const message_options = {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [[i18n.__("Create new task")], [i18n.__("List of tasks")]],
            }
        };
        bot.sendMessage(msg.chat.id, i18n.__("Choose action"), message_options);
    };

    return { sendLangKeyboard, sendActionsKeyboard };
};