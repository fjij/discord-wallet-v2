import { CommandContext } from "../framework";
import { UserModel } from "../db";
import { clearConnector } from "../connector";

export async function disconnect(ctx: CommandContext) {
  await ctx.reply("Clearing user data");

  try {
    await clearConnector(ctx.user.id);
    await UserModel.deleteOne({ userId: ctx.user.id });
    await ctx.reply("User data cleared.");
  } catch {
    await ctx.reply("Failed to clear user data. Please contact support.");
  }
}
