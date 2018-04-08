const Scene = require("telegraf/scenes/base");
const {match} = require('telegraf-i18n');
const {Markup} = require("telegraf");

const Task = require("../../database/Task");

const taskEditor = new Scene("taskEditor");

taskEditor.enter((ctx) => {
    return ctx.reply(ctx.i18n.t("Send new task name"), Markup.keyboard([
        ctx.i18n.t("keyboard.cancel")
    ]).oneTime().resize().extra());
});

taskEditor.hears(match("keyboard.cancel"), ctx => {
    return ctx.scene.enter('listViewer');
});

taskEditor.on("message", async ctx => {
    await Task.findByIdAndUpdate(ctx.session.activeTaskID, {$set: {name: ctx.message.text}}, {new: true}).exec();

    await ctx.reply(`${ctx.i18n.t("Task saved")}`, Markup.removeKeyboard().extra());
    return ctx.scene.enter('taskViewer');
});

module.exports = taskEditor;