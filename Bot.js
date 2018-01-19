const Telegraf = require("telegraf");
const LocalSession = require("telegraf-session-local");
const TelegrafI18n = require("telegraf-i18n");

const Stage = require("telegraf/stage");
const { leave } = Stage;

const config = require("./config");

const bot = new Telegraf(config.token);
bot.use((new LocalSession({ database: __dirname + '/database/sessions.json' })).middleware());

/* initialing translation module with dynamic json storage */
const i18n = new TelegrafI18n({
    useSession: true,
    directory: __dirname + "/locales",
});

bot.use(i18n.middleware());

// Create scene manager
const stage = new Stage();
// Scene registration
stage.register(require("./src/scenes/langSelector"));
stage.register(require("./src/scenes/taskCreator"));

bot.use(stage.middleware());

bot.start(require("./src/commands/start"));

bot.command('help', (ctx) => ctx.reply('help info'));

bot.command("lang", (ctx) => ctx.scene.enter("langSelector"));
bot.command("create", (ctx) => ctx.scene.enter("taskCreator"));

bot.startPolling();