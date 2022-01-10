import { Router, Command } from "../framework";
import { ConnectedUserModel } from "../db";
import { clearConnector } from "../connector";

export function useRoute(router: Router) {
  router
    .command(
      new Command(
        "disconnect",
        "Disconnects your mobile wallet - deletes all user data",
        {}
      )
    )
    .use(async (ctx) => {
      await ctx.reply("Clearing user data");

      try {
        await clearConnector(ctx.user.id);
        await ConnectedUserModel.deleteOne({ userId: ctx.user.id });
        await ctx.reply("User data cleared.");
      } catch {
        await ctx.reply("Failed to clear user data. Please contact support.");
      }
    });
}
