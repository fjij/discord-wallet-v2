import {
  CacheType,
  CommandInteraction,
  MessagePayload,
  WebhookEditMessageOptions
} from 'discord.js';

import { getConnector } from "./connector";

export function interactionUtils(interaction: CommandInteraction<CacheType>) {
  async function connect() {
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
    });
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
  return { connect, reply };
}
