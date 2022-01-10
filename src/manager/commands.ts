import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  Routes,
} from "discord-api-types/v9";
import { config } from "../config";
import { REST } from "@discordjs/rest";

export const baseCommands: Partial<APIApplicationCommand>[] = [
  {
    name: "setup",
    description: "setup this bot",
    options: [
      {
        name: "chain-id",
        type: ApplicationCommandOptionType.Number,
        description:
          "The ID of the blockchain to use - default 1 (mainnet ethereum)",
      },
      {
        name: "symbol",
        type: ApplicationCommandOptionType.String,
        description:
          "The symbol of the blockchain's native token - default ETH",
      },
    ],
  },
];

interface CustomCommandsOptions {
  symbol: string;
}

export function getCustomCommands({
  symbol,
}: CustomCommandsOptions): Partial<APIApplicationCommand>[] {
  return [
    {
      name: "connect",
      description: "Connect your mobile wallet",
    },
    {
      name: "disconnect",
      description: "Disconnect your mobile wallet - deletes all user data",
    },
    {
      name: "transfer",
      description: `Transfer ${symbol} to another user`,
      options: [
        {
          name: "to",
          type: ApplicationCommandOptionType.User,
          description: "The user to transfer to",
          required: true,
        },
        {
          name: "amount",
          type: ApplicationCommandOptionType.String,
          description: `The amount to transfer, in ${symbol}`,
          required: true,
        },
      ],
    },
  ];
}

export async function registerGuildCommands(
  guildId: string,
  commands: Partial<APIApplicationCommand>[]
) {
  const rest = new REST({ version: "9" }).setToken(config.botToken);
  await rest.put(
    Routes.applicationGuildCommands(config.applicationId, guildId),
    { body: commands }
  );
}