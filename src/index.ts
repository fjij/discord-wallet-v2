import { Client, Intents } from 'discord.js';

import { config } from "./config";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

import { transfer, disconnect, connect } from "./commands";
import { initDb } from "./db";

initDb();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "disconnect") {
    await disconnect(interaction);
  }

  if (interaction.commandName === "transfer") {
    await transfer(interaction);
  }

  if (interaction.commandName === "connect") {
    await connect(interaction);
  }
});

client.login(config.botToken);
