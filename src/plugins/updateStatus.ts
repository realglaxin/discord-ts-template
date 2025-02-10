import type { ExtendedClient } from "../structures/index";
import type { BotPlugin } from "./index";

const updateStatusPlugin: BotPlugin = {
  name: "Update Status Plugin",
  version: "1.0.0",
  author: "realglaxin",
  initialize: (client: ExtendedClient) => {
    client.on("ready", () => {
      const { user } = client;
      if (user) {
        user.setPresence(client.config.presence);
      }
    });
  },
};

export default updateStatusPlugin;
