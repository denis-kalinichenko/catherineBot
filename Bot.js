const TelegramBot = require('node-telegram-bot-api');
const i18n = require("i18n");

/* initialing translation module with dynamic json storage */
i18n.configure({
    locales:["en", "pl", "ru"],
    directory: __dirname + '/locales',
});

const config = require("./config");
const bot = new TelegramBot(config.token, {polling: true});

const { sendLangKeyboard, sendActionsKeyboard } = require("./src/utils/keyboards")(bot, i18n);

/* object contains all active users, stored in RAM */
const userStore = {};

// Greetings
bot.onText(/\/start/i, require('./src/commands/start')(bot, i18n, userStore));

// Set up commands
bot.onText(/\/lang+(.+|)/i, require('./src/commands/lang')(bot, i18n, userStore));
bot.onText(/\/create(?:@\w*)*/i, require('./src/commands/create')(bot, i18n, userStore));

// todo remove
bot.on("message", msg => {
    if (msg.video_note) {
        const fs = require("fs");
        bot.downloadFile(msg.video_note.file_id, "./videos").then(filePath => {
            fs.rename(filePath, filePath + ".mp4", (err) => {
                if (err) throw err;
                bot.sendDocument(msg.chat.id, filePath + ".mp4");
            });
        });
    }
});