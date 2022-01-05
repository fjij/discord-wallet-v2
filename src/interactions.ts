import {
  CacheType,
  CommandInteraction,
  MessagePayload,
  WebhookEditMessageOptions
} from 'discord.js';

import { getConnector } from "./connector";

import { Guild } from "./db";

import { UserFacingError } from "./error";

export function interactionUtils(interaction: CommandInteraction<CacheType>) {

  async function guild() {
    const guild = interaction.guild;
    if (guild) {
      const result = await Guild.findOne({ guildId: guild.id });
      if (result) {
        return result;
      }
    }
    throw new UserFacingError("Server hasn't setup this bot yet.");
  }

  async function connect(chainId: number) {
    return await getConnector(interaction.user.id, async (buffer) => {
      await interaction.reply({ 
        ephemeral: true,
        content: "Connect with WalletConnect",
        files: [{
          attachment: buffer,
          name: "qrcode.png",
          description: "qr code",
        }],
      });
    }, chainId);
  };

  async function reply(
    msg: string | MessagePayload | WebhookEditMessageOptions,
  ) {
    const objectMsg = typeof msg === "string" ? { content: msg } : msg;
    if (interaction.replied) {
      await interaction.editReply({ ...objectMsg, files: [], });
    } else {
      await interaction.reply({ ...objectMsg, ephemeral: true, files: [], });
    }
  }
  return { connect, reply, guild };
}
