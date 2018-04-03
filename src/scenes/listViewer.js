const Scene = require("telegraf/scenes/base");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const Task = require("../../database/Task");

const listViewer = new Scene('listViewer');

listViewer.enter((ctx) => {
    Task.find({
        chat_id: ctx.from.id,
    }).limit(5).exec((error, tasks) => {
        if (!tasks.length) {
            ctx.reply(`${ctx.i18n.t("No tasks")}: /create`);
            return;
        }

        const reponse = tasks.map(task => {
            return [Markup.callbackButton(task.name, task._id)];
        });

        return ctx.reply(`${ctx.i18n.t('List of your tasks')}:`, Extra.markup(m => m.inlineKeyboard(reponse)));
    });
});

listViewer.action(/.+/, ctx => {
    ctx.session.activeTaskID = ctx.match[0];
    return ctx.scene.enter('taskViewer');
});

module.exports = listViewer;