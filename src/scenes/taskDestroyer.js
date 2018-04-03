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

taskDestroyer.hears(match("keyboard.cancel"), (ctx) => {
    return ctx.scene.enter('listViewer');
});

taskDestroyer.hears(match("keyboard.delete"), (ctx) => {
    return Task.findByIdAndRemove(ctx.session.activeTaskID, error => {
        if (error) {
            return ctx.reply(ctx.i18n.t('alerts.Something went wrong'));
        }

        return ctx.reply(ctx.i18n.t('Task removed')).then(() => ctx.scene.enter('listViewer'));
    });
});

module.exports = taskDestroyer;