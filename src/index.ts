import { Client, Intents } from 'discord.js';

import { config } from "./config";
import { UserFacingError } from "./error";
import { interactionUtils } from "./interactions";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

import { transfer, disconnect, connect, setup } from "./commands";
import { initDb } from "./db";

initDb();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { reply } = interactionUtils(interaction);

  try {
    if (interaction.commandName === "disconnect") {
      await disconnect(interaction);
    }

    if (interaction.commandName === "transfer") {
      await transfer(interaction);
    }

    if (interaction.commandName === "connect") {
      await connect(interaction);
    }

    if (interaction.commandName === "setup") {
      await setup(interaction);
    }
  } catch (e) {
    if (e instanceof UserFacingError) {
      await reply(e.message);
    } else {
      console.error(e);
      await reply("An unknown error occurred");
    }
  }
});

client.login(config.botToken);
