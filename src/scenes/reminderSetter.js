const Scene = require("telegraf/scenes/base");
const {match} = require('telegraf-i18n');
const {Markup} = require("telegraf");


const moment = require("moment");
const parseFormat = require("../utils/parseFormat");

const Task = require("../../database/Task");

const reminderSetter = new Scene("reminderSetter");

reminderSetter.enter(ctx => {
    moment.locale(ctx.i18n.locale());
    return ctx.replyWithHTML(ctx.i18n.t('Send me date and time') + ` <i>${moment().format("LLL")}</i>`, Markup.keyboard([
        ctx.i18n.t("keyboard.cancel")
    ]).oneTime().resize().extra());
});

reminderSetter.hears(match("keyboard.cancel"), (ctx) => {
    return ctx.scene.enter('taskViewer');
});

reminderSetter.on('message', async ctx => {
    moment.locale(ctx.i18n.locale());

    const input = ctx.message.text;
    const format = parseFormat(moment)(input);

    const date = moment(input, format);

    if (!date.isValid()) {
        await ctx.reply(ctx.i18n.t('Incorrect date/time format'));
        return ctx.scene.reenter();
    }

    try {
        const task = await Task.setReminder(ctx.session.activeTaskID, date.toDate());

        const response = ctx.i18n.t('Reminder set success', {
            task: task.name,
            date: `<b>${date.format('LLL')}</b>`,
        });

        await ctx.replyWithHTML(response + " 🔔", Markup.removeKeyboard().extra());
        return ctx.scene.leave();
    } catch (e) {
        console.error(e);
        ctx.scene.reenter();
    }
});

module.exports = reminderSetter;