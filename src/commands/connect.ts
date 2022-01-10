import { UserModel } from "../db";
import { CommandContext } from "../framework";
import { walletConnectContext } from "../middleware";

export async function connect(rawCtx: CommandContext) {
  const ctx = rawCtx as CommandContext & walletConnectContext;

  await ctx.reply("Please use your wallet to verify your Discord account");

  const [account] = ctx.connector.accounts;

  try {
    const signature = await ctx.connector.signPersonalMessage([
      `My Discord account is ${ctx.user.tag}\n(id ${ctx.user.id})`,
      account,
    ]);
    await UserModel.findOneAndUpdate(
      { userId: ctx.user.id },
      { userId: ctx.user.id, account, signature },
      { new: true, upsert: true }
    ),
      await ctx.reply(`Address verified: \`${account}\``);
  } catch (e) {
    console.error(e);
    await ctx.reply("Account couldn't be verfied (rejected)");
  }
}
