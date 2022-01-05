import { CacheType, CommandInteraction } from "discord.js";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { baseCommands, getCustomCommands } from "../command-definitions";
import { config } from "../config";
import { interactionUtils } from "../interactions";
import { Guild } from "../db";

export async function setup(interaction: CommandInteraction<CacheType>) {
  const { reply } = interactionUtils(interaction);

  const { memberPermissions } = interaction;
  if (!(memberPermissions && memberPermissions.has("ADMINISTRATOR", true))) {
    return await reply("Sorry, only an administrator can do this.");
  }

  const chainId = interaction.options.get("chain-id", false)?.value ?? 1;
  const symbol = (
    interaction.options.get("symbol", false)?.value as string | null
  ) ?? "ETH";
  await reply("Setting up bot...");
  try {
    const rest = new REST({ version: '9' }).setToken(config.botToken);
    await rest.put(
      Routes.applicationGuildCommands(
        config.applicationId,
        process.env.GUILD_ID!,
      ),
      { body: [...baseCommands, ...getCustomCommands({ symbol })] },
    );
    await Guild.findOneAndUpdate(
      { guildId: interaction.guild },
      { guildId: interaction.guild, chainId, symbol },
      { new: true, upsert: true },
    );
    return await reply("Bot has been set up.");
  } catch {
    return await reply("Couldn't set up bot. Please contact support");
  }
}
