import type {
  CommandInteraction,
  CacheType,
  MessagePayload,
  WebhookEditMessageOptions,
  User,
  Guild,
} from "discord.js";

import { Command, OptionMap, CommandOptionType, OptionType } from "./command";

export class CommandContext<T extends OptionMap> {
  command: Command<T>;

  interaction: CommandInteraction<CacheType>;

  user: User;

  guild: Guild | null;

  constructor(command: Command<T>, interaction: CommandInteraction<CacheType>) {
    this.command = command;
    this.interaction = interaction;
    this.user = interaction.user;
    this.guild = interaction.guild;
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

  getOptions() {
    const entries = Object.keys(this.command.options).map((name) => {
      const option = this.command.options[name];
      const options = this.interaction.options;
      switch (option.type) {
        case CommandOptionType.User:
          return [name, options.getUser(name, option.required)];
        case CommandOptionType.Role:
          return [name, options.getRole(name, option.required)];
        case CommandOptionType.Number:
          return [name, options.getNumber(name, option.required)];
        case CommandOptionType.String:
          return [name, options.getString(name, option.required)];
        case CommandOptionType.Boolean:
          return [name, options.getBoolean(name, option.required)];
        case CommandOptionType.Channel:
          return [name, options.getChannel(name, option.required)];
        case CommandOptionType.Mentionable:
          return [name, options.getMentionable(name, option.required)];
        case CommandOptionType.Integer:
          return [name, options.getInteger(name, option.required)];
        default:
          return [name, undefined];
      }
    }).map(([a, b]) => [a, b === null ? undefined : b]);

    const options = Object.fromEntries(entries);
    return options as { [name in keyof T]: OptionType<T[name]> };
  }

  isAdmin(): boolean {
    const { memberPermissions } = this.interaction;
    if (!memberPermissions) {
      return false;
    }
    return memberPermissions.has("ADMINISTRATOR", true);
  }
}
