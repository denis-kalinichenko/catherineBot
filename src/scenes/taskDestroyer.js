const Scene = require("telegraf/scenes/base");
const {match} = require('telegraf-i18n');
const {Markup} = require("telegraf");

const Task = require("../../database/Task");

const taskDestroyer = new Scene("taskDestroyer");

taskDestroyer.enter(ctx => {
    return ctx.reply(ctx.i18n.t("alerts.Are you sure?"), Markup.keyboard([
        [ctx.i18n.t("keyboard.delete"), ctx.i18n.t("keyboard.cancel")]
    ]).oneTime().resize().extra());
});

taskDestroyer.hears(match("keyboard.cancel"), ctx => {
    return ctx.scene.enter('taskViewer');
});

taskDestroyer.hears(match("keyboard.delete"), async ctx => {
    await Task.findByIdAndRemove(ctx.session.activeTaskID).exec();
    await ctx.reply(ctx.i18n.t('Task removed'));
    return ctx.scene.enter('listViewer');
});

module.exports = taskDestroyer;