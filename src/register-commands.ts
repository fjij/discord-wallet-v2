import { baseCommands, registerGuildCommands } from "./manager";

import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await registerGuildCommands(process.env.GUILD_ID!, baseCommands);
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
