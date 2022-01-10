import {
  APIApplicationCommand,
  Routes,
} from "discord-api-types/v9";
import { config } from "./config";
import { REST } from "@discordjs/rest";

export async function registerGuildCommands(
  guildId: string,
  commands: Partial<APIApplicationCommand>[]
) {
  const rest = new REST({ version: "9" }).setToken(config.botToken);
  await rest.put(
    Routes.applicationGuildCommands(config.applicationId, guildId),
    { body: commands }
  );
}
