const Scene = require("telegraf/scenes/base");
const Extra = require('telegraf/extra');

const Task = require("../../database/Task");

const taskViewer = new Scene('taskViewer');

taskViewer.enter(ctx => {
    return Task.findById(ctx.session.activeTaskID).exec((error, task) => {
        if (error) {
            return ctx.answerCbQuery(`${ctx.i18n.t('alerts.Something went wrong')}... ${error}`);
        }

        const response = `<b>${ctx.i18n.t('Task')}</b>: ${task.name}\n` +
            `<b>${ctx.i18n.t('Reminder')}</b>: not defined \n` +
            `<b>${ctx.i18n.t('Created')}</b>: ${task.created}`;

        return ctx.editMessageText(response, Extra.HTML().markup(markup =>
            markup.inlineKeyboard([
                [markup.callbackButton(`🔔 ${ctx.i18n.t('Reminder')}`, 'TaskReminder')],
                [markup.callbackButton(`✏️ ${ctx.i18n.t('keyboard.edit')}`, 'EditTask')],
                [markup.callbackButton(`🗑 ${ctx.i18n.t('keyboard.delete')}`, 'DeleteTask')],
            ])));
    });
});

taskViewer.action('EditTask', ctx => {
    return ctx.scene.enter('taskEditor');
});

taskViewer.action('DeleteTask', ctx => {
    return ctx.scene.enter('taskDestroyer');
});

module.exports = taskViewer;