import { Router, Command, CommandOptionType } from "../framework";
import { GuildSettingsModel } from "../db";
import { adminOnly } from "../middleware";
import {
  registerGuildCommands,
  baseCommands,
  getCustomCommands,
} from "../manager";

export function useRoute(router: Router) {
  router
    .command(
      new Command("setup", "Setup this bot", {
        chain: {
          type: CommandOptionType.Number,
          description: "The ID of the blockchain to use - default 1 (ethereum)",
        },
        symbol: {
          type: CommandOptionType.String,
          description: "The symbol of the native token - default ETH",
        },
      })
    )
    .use(adminOnly)
    .use(async (ctx) => {
      await ctx.reply("Setting up bot...");

      const { chain = 1, symbol = "ETH" } = ctx.getOptions();

      try {
        await registerGuildCommands(ctx.guild!.id, [
          ...baseCommands,
          ...getCustomCommands({ symbol }),
        ]);
        await GuildSettingsModel.findOneAndUpdate(
          { guildId: ctx.guild!.id },
          { guildId: ctx.guild!.id, chainId: chain, symbol },
          { new: true, upsert: true }
        );
        return await ctx.reply("Bot has been set up.");
      } catch {
        return await ctx.reply("Couldn't set up bot. Please contact support");
      }
    });
}
