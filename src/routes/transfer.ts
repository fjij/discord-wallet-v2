import { Router, Command, CommandOptionType } from "../framework";
import { walletConnect, walletConnectContext } from "../middleware";
import { ethers } from "ethers";
import { ConnectedUserModel } from "../db";

export function useRoute(router: Router) {
  router
    .command(
      new Command("transfer", "Transfer native currency to another user", {
        to: {
          type: CommandOptionType.User,
          description: "The user to transfer to",
          required: true,
        },
        amount: {
          type: CommandOptionType.String,
          description: "The amount to transfer",
          required: true,
        },
      })
    )
    .use(walletConnect)
    .use(async (rawCtx) => {
      const ctx = rawCtx.extend<walletConnectContext>();
      const [account] = ctx.connector.accounts;
      const { to, amount } = ctx.getOptions();
      const result = await ConnectedUserModel.findOne({ userId: to.id });
      if (!result) {
        return await ctx.reply("The recepient hasn't connected a wallet.");
      }
      const toAccount = result.account;
      const bnAmount = ethers.utils.parseEther(amount);
      const formattedAmount = ethers.utils.formatEther(bnAmount);
      await ctx.reply(
        `Sending ${formattedAmount} ETH to ${to.toString()}\n` +
          `Address: \`${toAccount}\``
      );
      try {
        const hash = await ctx.connector.sendTransaction({
          from: account,
          to: toAccount,
          data: "0x",
          value: bnAmount.toHexString(),
        });
        await ctx.reply(
          `Sent ${formattedAmount} ETH to ${to.toString()}\n` +
            `Transaction Hash: \`${hash}\``
        );
      } catch {
        await ctx.reply(`Transaction failed (rejected)`);
      }
    });
}
