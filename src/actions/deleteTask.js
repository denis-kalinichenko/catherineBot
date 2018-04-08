module.exports = async ctx => {
    console.log(ctx.match[0]);
    ctx.session.activeTaskID = ctx.match[1];
    await ctx.answerCbQuery('Confirm the action');
    return ctx.scene.enter('taskDestroyer');
};