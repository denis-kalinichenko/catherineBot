const Scene = require("telegraf/scenes/base");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const Task = require("../../database/Task");

const listViewer = new Scene('listViewer');

listViewer.enter(async ctx => {
    try {
        const tasks = await Task.find({chat_id: ctx.from.id}).sort({done: 1, created: -1}).exec();

        if (!tasks.length) {
            return ctx.reply(`${ctx.i18n.t("No tasks")}: /create`);
        }

        const reponse = tasks.map(task => {
            let icon = task.done ? "✅" : "☑️";
            icon = task.reminder ? icon + " 🔔" : icon;
            return [Markup.callbackButton(icon + ' ' + task.name, "openTask-" + task._id)];
        });

        return ctx.reply(`${ctx.i18n.t('List of your tasks')}:`, Extra.markup(m => m.inlineKeyboard(reponse)));
    } catch (e) {
        console.error(e);
        ctx.scene.leave();
    }
});

module.exports = listViewer;