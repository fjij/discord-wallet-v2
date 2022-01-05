import { CacheType, CommandInteraction } from "discord.js";

import { User } from "../db";

import { clearConnector } from "../connector";

import { interactionUtils } from "../interactions";

export async function disconnect(interaction: CommandInteraction<CacheType>) {
  const { reply } = interactionUtils(interaction);
  await reply("Clearing user data");

  try {
    await clearConnector(interaction.user.id);
    await User.deleteOne({ userId: interaction.user.id });
    await reply("User data cleared.");
  } catch {
    await reply("Failed to clear user data. Please contact support.");
  }
}
