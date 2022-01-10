import {
  APIApplicationCommand,
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from "discord-api-types";

import type { User, Role, GuildMember, Channel } from "discord.js";

type Option = Omit<APIApplicationCommandOption, "name">;

export import CommandOptionType = ApplicationCommandOptionType;

export interface CommandOpts {
  name: string;
  description?: string;
  options: {
    [key: string]: Option;
  };
}

export type OptionType<O extends Option> = O["required"] extends true
  ? BaseOptionType<O>
  : BaseOptionType<O> | undefined;

export type BaseOptionType<O extends Option> =
  O["type"] extends CommandOptionType.User
    ? User
    : O["type"] extends CommandOptionType.Number
    ? number
    : O["type"] extends CommandOptionType.Integer
    ? number
    : O["type"] extends CommandOptionType.Role
    ? Role
    : O["type"] extends CommandOptionType.Mentionable
    ? User | Role | GuildMember
    : O["type"] extends CommandOptionType.String
    ? string
    : O["type"] extends CommandOptionType.Boolean
    ? boolean
    : O["type"] extends CommandOptionType.Channel
    ? Channel
    : null;

export interface OptionMap {
  [key: string]: Option;
}

export class Command<T extends OptionMap> {
  name: string;
  description?: string;
  options: T;

  constructor(name: string, description: string, options: T) {
    this.name = name;
    this.description = description;
    this.options = options;
  }

  getAPICommand(): Partial<APIApplicationCommand> {
    return {
      name: this.name,
      description: this.description,
      options: Object.entries(this.options).map(([name, rest]) => ({
        name,
        ...rest,
      })) as APIApplicationCommandOption[],
    };
  }
}
