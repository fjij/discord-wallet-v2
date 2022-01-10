import WalletConnect from "@walletconnect/client";
import { CommandContext } from "../framework";
import { GuildModel } from "../db";
import { getConnector } from "../connector";
import { UserFacingError } from "../error";

async function getGuild(ctx: CommandContext) {
  const guild = ctx.interaction.guild;
  if (guild) {
    const result = await GuildModel.findOne({ guildId: guild.id });
    if (result) {
      return result;
    }
  }
  throw new UserFacingError("Server hasn't setup this bot yet.");
}

export interface walletConnectContext {
  connector: WalletConnect;
}

export async function walletConnect(ctx: CommandContext) {
  const { chainId } = await getGuild(ctx);
  const connector = await getConnector(
    ctx.user.id,
    async (buffer) => {
      await ctx.interaction.reply({
        ephemeral: true,
        content: "Connect with WalletConnect",
        files: [
          {
            attachment: buffer,
            name: "qrcode.png",
            description: "qr code",
          },
        ],
      });
    },
    chainId
  );
  (ctx as CommandContext & walletConnectContext).connector = connector;
  return ctx;
}
