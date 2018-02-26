const Scene = require("telegraf/scenes/base");

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

        const reponse = tasks.map((task, index) => {
            return `<b> ${index + 1}.</b> ${task.name}\n`;
        }).join("");

        ctx.replyWithHTML(reponse);
    });
});

module.exports = listViewer;