const User = require("../../database/User");

/**
 * Command to display welcome message
 *
 * @param ctx - bot context
 * @returns {function(*, *)}
 */
module.exports = async ctx => {
    try {
        await User.check({ chat_id: ctx.from.id, username: ctx.from.username });

        const message = ctx.i18n.t('Hi user', {
            username: ctx.from.username,
        });

        return ctx.reply(message);
    } catch (e) {
        console.error(e);
    }
};