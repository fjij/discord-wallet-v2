import WalletConnect from "@walletconnect/client";
import { CommandContext } from "../framework";
import { GuildSettingsModel } from "../db";
import { getConnector } from "../connector";
import { UserFacingError } from "../error";

async function getGuildSettings(ctx: CommandContext<any>) {
  const guild = ctx.interaction.guild;
  if (guild) {
    const guildSettings = await GuildSettingsModel.findOne({ guildId: guild.id });
    if (guildSettings) {
      return guildSettings;
    }
  }
  throw new UserFacingError("Server hasn't setup this bot yet.");
}

export interface walletConnectContext {
  connector: WalletConnect;
}

export async function walletConnect(ctx: CommandContext<any>) {
  const { chainId } = await getGuildSettings(ctx);
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
  (ctx as CommandContext<any> & walletConnectContext).connector = connector;
  return ctx;
}
