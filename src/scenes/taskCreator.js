const Scene = require("telegraf/scenes/base");
const {match} = require('telegraf-i18n');
const {Markup, Extra} = require("telegraf");

const Task = require("../../database/Task");

const taskCreator = new Scene("taskCreator");

taskCreator.enter((ctx) => {
    return ctx.reply(ctx.i18n.t("Send task name"), Markup.keyboard([
        ctx.i18n.t("keyboard.cancel")
    ]).oneTime().resize().extra());
});

taskCreator.hears(match("keyboard.cancel"), (ctx) => {
    return ctx.scene.leave();
});

taskCreator.on("message", (ctx) => {
    const task = new Task({
        chat_id: ctx.from.id,
        name: ctx.message.text,
    });

    return task.save((error, createdTask) => {
        if (error) {
            return console.error(error);
        }

        ctx.reply(`${ctx.i18n.t("Task created")}`).then(() => ctx.scene.leave());
    });
});

taskCreator.leave((ctx) => ctx.reply(ctx.i18n.t("Check list") + " /list", Markup.removeKeyboard().extra()));

module.exports = taskCreator;


/*
Markup.removeKeyboard().extra()).then(() => {
    return ctx.replyWithHTML(`✅ Task\n` +
        `\n<b>${ctx.message.text}</b> `,
        Extra.markup((markup) => {
            return markup.inlineKeyboard([
                [markup.callbackButton('🔔 Reminder', 'TaskReminder')],
                [markup.callbackButton('✏️ Edit', 'EditTask')],
                [markup.callbackButton('🗑 Delete', 'DeleteTask')],
            ]).resize();

        }));
}*/
