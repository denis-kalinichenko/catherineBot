const Scene = require("telegraf/scenes/base");
const {match} = require('telegraf-i18n');
const {Markup} = require("telegraf");

const Task = require("../../database/Task");

const reminderSetter = new Scene("reminderSetter");

reminderSetter.enter(ctx => {
    return ctx.reply('reminderSetter');
});

module.exports = reminderSetter;