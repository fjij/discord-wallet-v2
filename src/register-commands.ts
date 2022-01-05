import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { commands } from "./command-definitions";

import dotenv from "dotenv";
dotenv.config();

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN!);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID!,
        process.env.GUILD_ID!,
      ),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
