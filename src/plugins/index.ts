import fs from "node:fs";
import path from "node:path";
import type { ExtendedClient } from "../structures/index";

const pluginsFolder = __dirname;

export default async function loadPlugins(
  client: ExtendedClient
): Promise<void> {
  try {
    const pluginFiles = fs
      .readdirSync(pluginsFolder)
      .filter((file) => file.endsWith(".js") && file !== "index.js");
    for (const file of pluginFiles) {
      const pluginPath = path.join(pluginsFolder, file);
      const { default: plugin } = require(pluginPath);
      if (plugin.initialize) plugin.initialize(client);
      client.logger.info(
        `[PLUGIN] Loaded plugin: ${plugin.name} v${plugin.version}`
      );
    }
  } catch (error) {
    client.logger.error(`Error loading plugins: ${error}`, client);
  }
}

export interface BotPlugin {
  name: string;
  version: string;
  author: string;
  description?: string;
  initialize: (client: ExtendedClient) => void;
  shutdown?: (client: ExtendedClient) => void;
}
