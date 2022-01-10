import { Client, Intents } from "discord.js";

import { config } from "./config";
import { UserFacingError } from "./error";
import { Router, CommandContext } from "./framework";
import { transfer, disconnect, connect, setup } from "./commands";
import { initDb } from "./db";
import { adminOnly } from "./middleware";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

async function errorHandler(e: unknown, req: CommandContext) {
  if (e instanceof UserFacingError) {
    await req.reply(e.message);
  } else {
    console.error(e);
    await req.reply("An unknown error occurred");
  }
}

const router = new Router();

router.command("connect").use(connect).catch(errorHandler);

router.command("disconnect").use(disconnect).catch(errorHandler);

router.command("transfer").use(transfer).catch(errorHandler);

router.command("setup").use(adminOnly).use(setup).catch(errorHandler);

client.on("interactionCreate", router.interactionCreate());

async function init() {
  await initDb();
  await client.login(config.botToken);
}

init();
