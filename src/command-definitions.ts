import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
} from 'discord-api-types/v9';

export const commands: Partial<APIApplicationCommand>[] = [
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
    description: "Transfer ETH to another user",
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
        description: "The amount to transfer, in ETH",
        required: true,
      },
    ],
  },
];
