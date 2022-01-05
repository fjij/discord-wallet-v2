import { CacheType, CommandInteraction } from "discord.js";
import { ethers } from "ethers";
import { Signature } from "../db";
import { interactionUtils } from "../interactions";

export async function transfer(interaction: CommandInteraction<CacheType>) {
  const { connect, reply } = interactionUtils(interaction);
  const connector = await connect();
  const [account] = connector.accounts;
  const to = interaction.options.get("to", true).user!;
  const amount = interaction.options.get("amount", true).value! as string;
  const result = await Signature.findOne({ userId: to.id });
  if (!result) {
    return await reply("The recepient hasn't connected a wallet.");
  }
  const toAccount = result.account;
  const bnAmount = ethers.utils.parseEther(amount);
  await reply(
    `Sending ${ethers.utils.formatEther(bnAmount)} ETH to ${to.toString()}\n`
    + `Address: \`${toAccount}\``,
  );
  try {
    const hash = await connector.sendTransaction({
      from: account,
      to: toAccount,
      data: "0x",
      value: bnAmount.toHexString(),
    });
    await reply(
      `Sent ${ethers.utils.formatEther(bnAmount)} ETH to ${to.toString()}\n`
      + `Transaction Hash: \`${hash}\``,
    );
  } catch {
    await reply(`Transaction failed (rejected)`);
  }
}
