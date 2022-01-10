import { Router, CommandContext } from "../framework";
import { UserFacingError } from "../error";

async function errorHandler(
  e: unknown,
  req: CommandContext<any>
) {
  if (e instanceof UserFacingError) {
    await req.reply(e.message);
  } else {
    console.error(e);
    await req.reply("An unknown error occurred");
  }
}

import { useRoute as useConnect } from "./connect";
import { useRoute as useSetup } from "./setup";
import { useRoute as useDisconnect } from "./disconnect";
import { useRoute as useTransfer } from "./transfer";

export const router = new Router();

router.catch(errorHandler);
useConnect(router);
useSetup(router);
useDisconnect(router);
useTransfer(router);

export const APICommands = router.getAPICommands();
