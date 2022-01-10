import { Client, Intents } from "discord.js";

import { config } from "./config";
import { Router } from "./framework";
import { initDb } from "./db";
import { useRoutes } from "./routes";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

const router = new Router();

useRoutes(router);

client.on("interactionCreate", router.interactionCreate());

async function init() {
  await initDb();
  await client.login(config.botToken);
}

init();
