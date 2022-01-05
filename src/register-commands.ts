import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { baseCommands } from "./command-definitions";
import { config } from "./config";

import dotenv from "dotenv";
dotenv.config();

const rest = new REST({ version: '9' }).setToken(config.botToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(
        config.applicationId,
        process.env.GUILD_ID!,
      ),
      { body: baseCommands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
