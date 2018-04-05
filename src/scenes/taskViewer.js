const Scene = require("telegraf/scenes/base");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const moment = require('moment');

const Task = require("../../database/Task");

const taskViewer = new Scene('taskViewer');

taskViewer.enter(ctx => {
    return Task.findById(ctx.session.activeTaskID).exec((error, task) => {
        if (error) {
            return ctx.answerCbQuery(`${ctx.i18n.t('alerts.Something went wrong')}... ${error}`);
        }

        moment.locale(ctx.i18n.locale());

        const response = `📝 <b>${ctx.i18n.t('Task')}</b>: ${task.name}\n` +
            `🔕 <b>${ctx.i18n.t('Reminder')}</b>: ${ctx.i18n.t('No reminder')} \n` +
            `📆 <b>${ctx.i18n.t('Created')}</b> ${moment(task.created).format('LLL')}`;

        const changeStatusButton = !task.done ?
            Markup.callbackButton(`✅ ${ctx.i18n.t('Mark as done')}`, 'StatusDone') :
            Markup.callbackButton(`🚫 ${ctx.i18n.t('Mark as to do')}`, 'StatusTODO');

        return ctx.editMessageText(response, Extra.HTML().markup(markup =>
            markup.inlineKeyboard([
                [changeStatusButton],
                [markup.callbackButton(`🔔 ${ctx.i18n.t('Reminder')}`, 'TaskReminder')],
                [markup.callbackButton(`✏️ ${ctx.i18n.t('keyboard.edit')}`, 'EditTask')],
                [markup.callbackButton(`🗑 ${ctx.i18n.t('keyboard.delete')}`, 'DeleteTask')],
            ])));
    });
});

taskViewer.action('StatusDone', ctx => {
    return Task.setDone(ctx.session.activeTaskID, error => {
            if (error) {
                return console.error(error);
            }

            return ctx.scene.reenter();
        });
});

taskViewer.action('StatusTODO', ctx => {
    return Task.setTodo(ctx.session.activeTaskID, error => {
            if (error) {
                return console.error(error);
            }

            return ctx.scene.reenter();
        });
});

taskViewer.action('EditTask', ctx => {
    return ctx.scene.enter('taskEditor');
});

taskViewer.action('DeleteTask', ctx => {
    return ctx.scene.enter('taskDestroyer');
});

taskViewer.action('TaskReminder', ctx => {
    return ctx.scene.enter('reminderSetter');
});

module.exports = taskViewer;