import { registerGuildCommands } from "../src/discord";
import { router } from "../src/routes";

import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await registerGuildCommands(process.env.GUILD_ID!, router.getAPICommands());
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
