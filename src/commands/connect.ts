import { CacheType, CommandInteraction } from "discord.js";
import { interactionUtils } from "../interactions";
import { User } from "../db";

export async function connect(interaction: CommandInteraction<CacheType>) {
  const utils = interactionUtils(interaction);

  const { reply, guild } = utils;

  const { chainId } = await guild();

  const connector = await utils.connect(chainId);

  const { user } = interaction;

  await reply("Please use your wallet to verify your Discord account");

  const [account] = connector.accounts;

  try {
    const signature = await connector.signPersonalMessage([
      `My Discord account is ${user.tag}\n(id ${user.id})`,
      account,
    ]);
    await User.findOneAndUpdate(
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
