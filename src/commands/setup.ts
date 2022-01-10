import {
  baseCommands,
  getCustomCommands,
  registerGuildCommands,
} from "../manager";

import { GuildModel } from "../db";
import { CommandContext } from "../framework";

export async function setup(ctx: CommandContext) {
  if (!ctx.guild) {
    return await ctx.reply("Must be in a server.");
  }

  const chainId = ctx.options.get("chain-id", false)?.value ?? 1;
  const symbol =
    (ctx.options.get("symbol", false)?.value as string | null) ?? "ETH";
  await ctx.reply("Setting up bot...");
  try {
    await registerGuildCommands(ctx.guild.id, [
      ...baseCommands,
      ...getCustomCommands({ symbol }),
    ]);
    await GuildModel.findOneAndUpdate(
      { guildId: ctx.guild.id },
      { guildId: ctx.guild.id, chainId, symbol },
      { new: true, upsert: true }
    );
    return await ctx.reply("Bot has been set up.");
  } catch {
    return await ctx.reply("Couldn't set up bot. Please contact support");
  }
}
