import type { Interaction, CacheType } from "discord.js";
import { Route } from "./route";
import { CommandContext } from "./command-context";

export class Router {
  commandRoutes: {
    [key: string]: Route<CommandContext>;
  } = {};

  interactionCreate(): (i: Interaction<CacheType>) => Promise<void> {
    return async (i: Interaction<CacheType>) => {
      if (i.isCommand()) {
        const route = this.commandRoutes[i.commandName];
        if (route) {
          return await route.handle(new CommandContext(i));
        }
      }
    };
  }

  command(name: string) {
    if (!this.commandRoutes[name]) {
      this.commandRoutes[name] = new Route();
    }
    return this.commandRoutes[name];
  }
}
