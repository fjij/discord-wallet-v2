import { CommandContext } from "../framework";
import { UserFacingError } from "../error";

export async function adminOnly(ctx: CommandContext) {
  if (!ctx.isAdmin()) {
    throw new UserFacingError("Sorry, only an administrator can do this.");
  }
  return ctx;
}
