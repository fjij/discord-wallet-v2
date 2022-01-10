import { walletConnectContext } from "../middleware";
import { ethers } from "ethers";
import { UserModel } from "../db";
import { CommandContext } from "../framework";

export async function transfer(rawCtx: CommandContext) {
  const ctx = rawCtx as CommandContext & walletConnectContext;
  const [account] = ctx.connector.accounts;
  const to = ctx.options.get("to", true).user!;
  const amount = ctx.options.get("amount", true).value! as string;
  const result = await UserModel.findOne({ userId: to.id });
  if (!result) {
    return await ctx.reply("The recepient hasn't connected a wallet.");
  }
  const toAccount = result.account;
  const bnAmount = ethers.utils.parseEther(amount);
  await ctx.reply(
    `Sending ${ethers.utils.formatEther(bnAmount)} ETH to ${to.toString()}\n` +
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
      `Sent ${ethers.utils.formatEther(bnAmount)} ETH to ${to.toString()}\n` +
        `Transaction Hash: \`${hash}\``
    );
  } catch {
    await ctx.reply(`Transaction failed (rejected)`);
  }
}
