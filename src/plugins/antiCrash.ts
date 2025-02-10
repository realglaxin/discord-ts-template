import type { ExtendedClient } from "../structures/index";
import type { BotPlugin } from "./index";

const antiCrash: BotPlugin = {
  name: "AntiCrash Plugin",
  version: "1.0.0",
  author: "realglaxin",
  initialize: (client: ExtendedClient) => {
    const handleExit = async (): Promise<void> => {
      if (client) {
        client.logger.warn("Disconnecting from Discord...");
        await client.destroy();
        client.logger.success("Successfully disconnected from Discord!");
        process.exit();
      }
    };
    process.on("unhandledRejection", (reason, promise) => {
      client.logger.error(
        `Unhandled Rejection at: ${promise} reason: ${reason}`,
        client
      );
    });
    process.on("uncaughtException", (err) => {
      client.logger.error(`Uncaught Exception: ${err}`, client);
    });
    process.on("SIGINT", handleExit);
    process.on("SIGTERM", handleExit);
    process.on("SIGQUIT", handleExit);
  },
};

export default antiCrash;
