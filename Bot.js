const Telegraf = require("telegraf");
const LocalSession = require("telegraf-session-local");
const TelegrafI18n = require("telegraf-i18n");
const Stage = require("telegraf/stage");
const { leave } = Stage;

const config = require("./config");

/* Creating new bot instance */
const bot = new Telegraf(config.token);

/* Session manager registration */
bot.use((new LocalSession({ database: __dirname + '/database/sessions.json' })).middleware());

/* Initialing translation module with dynamic json storage */
const i18n = new TelegrafI18n({
    useSession: true,
    directory: __dirname + "/locales",
});

/* Translation module registration */
bot.use(i18n.middleware());

/* Create scene manager */
const stage = new Stage();

/* Scenes registration */
stage.register(require("./src/scenes/langSelector"));
stage.register(require("./src/scenes/taskCreator"));
stage.register(require("./src/scenes/listViewer"));
stage.register(require("./src/scenes/taskViewer"));
stage.register(require("./src/scenes/taskEditor"));
stage.register(require("./src/scenes/taskDestroyer"));
stage.register(require("./src/scenes/reminderSetter"));

/* Stage registration */
bot.use(stage.middleware());

/* Commands registration */
bot.start(require("./src/commands/start"));
bot.command('help', require("./src/commands/help"));
bot.command("lang", (ctx) => ctx.scene.enter("langSelector"));
bot.command("create", (ctx) => ctx.scene.enter("taskCreator"));
bot.command("list", (ctx) => ctx.scene.enter("listViewer"));

/* Starting bot */
bot.startPolling();