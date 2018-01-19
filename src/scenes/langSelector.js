const Scene = require("telegraf/scenes/base");
const { Markup } = require("telegraf");


const LOCALES = ['🇺🇸 English', '🇷🇺 Русский', '🇵🇱 Polski'];

const langSelector = new Scene('langSelector');

const keyboard = Markup.keyboard([LOCALES]).oneTime().resize().extra();

langSelector.enter((ctx) => {
    return ctx.reply(ctx.i18n.t("Choose your language"), keyboard);
});

langSelector.leave((ctx) => ctx.reply(ctx.i18n.t("Language selected"), Markup.removeKeyboard().extra()));

langSelector.hears(LOCALES, (ctx) => {
    switch(ctx.match) {
        case LOCALES[0]:
            ctx.i18n.locale("en");
            break;
        case LOCALES[1]:
            ctx.i18n.locale("ru");
            break;
        case LOCALES[2]:
            ctx.i18n.locale("pl");
    }

    return ctx.scene.leave();
});

langSelector.on('message', (ctx) => {
    return ctx.reply(ctx.i18n.t("Choose your language"), keyboard);
});

module.exports = langSelector;