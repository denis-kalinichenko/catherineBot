const Scene = require("telegraf/scenes/base");
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const moment = require('moment');

const Task = require("../../database/Task");

const taskViewer = new Scene('taskViewer');

taskViewer.enter(async ctx => {
    const task = await Task.findById(ctx.session.activeTaskID).exec();

    if (!task) {
        return ctx.reply(`${ctx.i18n.t('alerts.Something went wrong')}... `);
    }

    moment.locale(ctx.i18n.locale());

    const reminderInfo = task.reminder ? moment(task.reminder).format("LLL") : ctx.i18n.t('No reminder');
    const reminderIcon = task.reminder ? "🔔" : "🔕";

    const response = `📝 ${task.name}\n` +
        reminderIcon + ` <b>${ctx.i18n.t('Reminder')}</b> ${reminderInfo} \n` +
        `📆 <b>${ctx.i18n.t('Created')}</b> ${moment(task.created).format('LLL')}`;

    const changeStatusButton = !task.done ?
        Markup.callbackButton(`✅ ${ctx.i18n.t('Mark as done')}`, 'StatusDone') :
        Markup.callbackButton(`🚫 ${ctx.i18n.t('Mark as to do')}`, 'StatusTODO');

    return ctx.reply(response, Extra.HTML().markup(markup =>
        markup.inlineKeyboard([
            [changeStatusButton],
            [markup.callbackButton(`🔔 ${ctx.i18n.t('Reminder')}`, 'remindTask-' + task._id)],
            [markup.callbackButton(`✏️ ${ctx.i18n.t('keyboard.edit')}`, 'editTask-' + task._id)],
            [markup.callbackButton(`🗑 ${ctx.i18n.t('keyboard.delete')}`, 'deleteTask-' + task._id)],
        ])));
});

taskViewer.action('StatusDone', async ctx => {
    try {
        await Task.setDone(ctx.session.activeTaskID);
    } catch (e) {
        console.error(e);
    }

    await ctx.answerCbQuery('Marked as Done');
    return ctx.scene.reenter();
});

taskViewer.action('StatusTODO', async ctx => {
    try {
        await Task.setTodo(ctx.session.activeTaskID);
    } catch (e) {
        console.error(e);
    }

    await ctx.answerCbQuery('Marked as TO DO');
    return ctx.scene.reenter();
});

module.exports = taskViewer;