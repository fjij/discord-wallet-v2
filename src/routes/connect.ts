import { Router, Command } from "../framework";
import { ConnectedUserModel } from "../db";
import { walletConnect, walletConnectContext } from "../middleware";

export function useRoute(router: Router) {
  router
    .command(new Command("connect", "Connect your mobile wallet", {}))
    .use(walletConnect)
    .use(async (rawCtx) => {
      const ctx = rawCtx.extend<walletConnectContext>();

      await ctx.reply("Please use your wallet to verify your Discord account");

      const [account] = ctx.connector.accounts;

      try {
        const signature = await ctx.connector.signPersonalMessage([
          `My Discord account is ${ctx.user.tag}\n(id ${ctx.user.id})`,
          account,
        ]);
        await ConnectedUserModel.findOneAndUpdate(
          { userId: ctx.user.id },
          { userId: ctx.user.id, account, signature },
          { new: true, upsert: true }
        ),
          await ctx.reply(`Address verified: \`${account}\``);
      } catch (e) {
        console.error(e);
        await ctx.reply("Account couldn't be verfied (rejected)");
      }
    });
}
