import type { Interaction, CacheType } from "discord.js";
import { Route, ErrorHandler } from "./route";
import { Command, OptionMap } from "./command";
import { CommandContext } from "./command-context";

export class Router {
  commandRoutes: {
    [key: string]: {
      command: Command<any>;
      route: Route<CommandContext<any>>;
    };
  } = {};

  defaultCommandErrorHandler?: ErrorHandler<CommandContext<any>>;

  interactionCreate(): (i: Interaction<CacheType>) => Promise<void> {
    return async (i: Interaction<CacheType>) => {
      if (i.isCommand()) {
        const result = this.commandRoutes[i.commandName];
        if (result) {
          return await result.route.handle(
            new CommandContext(result.command, i)
          );
        }
      }
    };
  }

  command<T extends OptionMap>(command: Command<T>): Route<CommandContext<T>> {
    if (!this.commandRoutes[command.name]) {
      const route: Route<CommandContext<T>> = new Route();
      this.commandRoutes[command.name] = { command, route };

      if (this.defaultCommandErrorHandler) {
        route.catch(this.defaultCommandErrorHandler);
      }
      return route;
    } else {
      throw new Error("this route is already defined");
    }
  }

  catch(handler: ErrorHandler<CommandContext<any>>) {
    this.defaultCommandErrorHandler = handler;
    Object.entries(this.commandRoutes).forEach(([_, { route }]) => {
      if (!route.errorHandler) {
        route.catch(handler);
      }
    });
  }
}
