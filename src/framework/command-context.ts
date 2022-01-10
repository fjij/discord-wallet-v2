import type {
  CommandInteraction,
  CacheType,
  MessagePayload,
  WebhookEditMessageOptions,
  CommandInteractionOptionResolver,
  User,
  Guild,
} from "discord.js";

export class CommandContext {
  interaction: CommandInteraction<CacheType>;

  user: User;

  guild: Guild | null;

  options: Omit<
    CommandInteractionOptionResolver<CacheType>,
    "getMessage" | "getFocused"
  >;

  constructor(interaction: CommandInteraction<CacheType>) {
    this.interaction = interaction;
    this.user = interaction.user;
    this.guild = interaction.guild;
    this.options = interaction.options;
  }

  async reply(msg: string | MessagePayload | WebhookEditMessageOptions) {
    const objectMsg = typeof msg === "string" ? { content: msg } : msg;
    if (this.interaction.replied) {
      await this.interaction.editReply({ ...objectMsg, files: [] });
    } else {
      await this.interaction.reply({
        ...objectMsg,
        ephemeral: true,
        files: [],
      });
    }
  }

  isAdmin(): boolean {
    const { memberPermissions } = this.interaction;
    if (!memberPermissions) {
      return false;
    }
    return memberPermissions.has("ADMINISTRATOR", true);
  }
}
