import { CacheType, CommandInteraction } from "discord.js";
import { interactionUtils } from "../interactions";
import { Signature } from "../db";

export async function connect(interaction: CommandInteraction<CacheType>) {
  const utils = interactionUtils(interaction);

  const connector = await utils.connect();

  const { user } = interaction;

  const { reply } = utils;

  await reply("Please use your wallet to verify your Discord account");

  const [account] = connector.accounts;

  try {
    const signature = await connector.signPersonalMessage([
      `My Discord account is ${user.tag}\n(id ${user.id})`,
      account,
    ]);
    await Signature.findOneAndUpdate(
      { userId: user.id },
      { userId: user.id, account, signature },
      { new: true, upsert: true },
    ),
    await reply(`Address verified: \`${account}\``);
  } catch(e) {
    console.error(e);
    await reply("Account couldn't be verfied (rejected)");
  }
}
