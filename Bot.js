const TelegramBot = require('node-telegram-bot-api');
const i18n = require("i18n");

/* initialing translation module with dynamic json storage */
i18n.configure({
    locales:["en", "pl", "ru"],
    directory: __dirname + '/locales',
});

const config = require("./config");
const bot = new TelegramBot(config.token, {polling: true});

const { sendLangKeyboard, sendActionsKeyboard } = require("./src/keyboards")(bot, i18n);

const User = require("./model/User");

/* object contains all active users, stored in RAM */
const userStore = {};

bot.onText(/\/start/, (msg) => {
    User.check(msg.chat, (error, user) => {
        if (error) return console.error(error);

        userStore[msg.username] = user;

        if (!user.language) {
            sendLangKeyboard(msg, `Hi, <b>${msg.chat.first_name}</b>. What language do you speak?`);
            return;
        }

        i18n.setLocale(user.language);

        let message_body = i18n.__("Hi user", msg.chat.first_name);

        bot.sendMessage(msg.chat.id, message_body);
    });
});

bot.onText(/\/lang$/, msg => {
    return sendLangKeyboard(msg);
});

bot.onText(/\/lang (.+)/, (msg, match) => {
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
});

bot.onText(/\/create (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const body = match[1].toLowerCase();
});