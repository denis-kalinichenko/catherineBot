const TelegramBot = require('node-telegram-bot-api');
const config = require("./config");
const bot = new TelegramBot(config.token, {polling: true});

const User = require("./model/User");

bot.onText(/\/start/, (msg) => {
    let message_body = `Hi, ${msg.chat.first_name}. What's up?`;
    let message_options;

    User.check(msg.chat, (error, user) => {
        if (error) return console.error(error);

        if (!user.language) {
            message_body = `Hi, <b>${msg.chat.first_name}</b>. What language do you speak?`;
            message_options = {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [["/lang English 🇺🇸"], ["/lang Русский 🇷🇺"], ["/lang Polski 🇵🇱"]],
                }
            };
        }

        bot.sendMessage(msg.chat.id, message_body, message_options);
    });
});

bot.onText(/\/lang (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const body = match[1].toLowerCase();
    let lang, response;

    if (body.includes("en")) {
        lang = "EN";
        response = "OK. What's up?";
    }

    if (body.includes("ру")) {
        lang = "RU";
        response = "Окей, принято. Как дела?";
    }

    if (body.includes("pol")) {
        lang = "PL";
        response = "OK, dzięki. Jak tam?";
    }

    User.findOneAndUpdate({ chat_id: chatId }, { language: lang }, (error, user) => {
        if (error) return console.error(error);

        bot.sendMessage(chatId, response, {
            reply_markup: {hide_keyboard: true},
        });
    });
});