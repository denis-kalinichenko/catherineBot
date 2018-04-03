const Scene = require("telegraf/scenes/base");
const {match} = require('telegraf-i18n');
const {Markup} = require("telegraf");

const Task = require("../../database/Task");

const taskCreator = new Scene("taskCreator");

taskCreator.enter((ctx) => {
    return ctx.reply(ctx.i18n.t("Send task name"), Markup.keyboard([
        ctx.i18n.t("keyboard.cancel")
    ]).oneTime().resize().extra());
});

taskCreator.hears(match("keyboard.cancel"), (ctx) => {
    return ctx.scene.enter('listViewer');
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

        ctx.reply(`${ctx.i18n.t("Task created")}`, Markup.removeKeyboard().extra()).then(() => ctx.scene.enter('listViewer'));
    });
});

module.exports = taskCreator;