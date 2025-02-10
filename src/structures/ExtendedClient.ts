import fs from "node:fs";
import path from "node:path";
import {
  ApplicationCommandType,
  Client,
  ClientOptions,
  Collection,
  ColorResolvable,
  PermissionsBitField,
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  WebhookClient,
} from "discord.js";
import config from "../config";
import loadPlugins from "../plugins/index";
import { Utils } from "../functions/Utils";
import logger from "./Logger";
import type { Command } from "./index";
import { ClusterClient } from "discord-hybrid-sharding";
import connectDatabase from "../database";
import { ExtendedEmbedBuilder } from "../functions/Embed";
import { ExtendedButtonBuilder } from "../functions/Button";
import { Client as DokdoClient } from "dokdo";
import CustomPrefix from "../database/schemas/CustomPrefix";

interface WebhookConfig {
  cmdlogs: string;
  guildlogs: string;
  errorlogs: string;
}

export default class ExtendedClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.on("debug", (data) => this.logger.debug(data));
  }
  public commands: Collection<string, any> = new Collection();
  public aliases: Collection<string, any> = new Collection();
  public cooldown: Collection<string, any> = new Collection();
  public config = config.client;
  public cluster = new ClusterClient(this);
  public logger = logger;
  public readonly color = config.color;
  public readonly emoji = config.emojis;
  public readonly links = config.links;
  private body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  public utils = Utils;

  public readonly prefix = this.config.prefix;

  public dokdo = new DokdoClient(this, {
    aliases: ["dokdo", "jsk"],
    prefix: this.prefix,
    owners: this.config.owners,
    secrets: [this.config.token],
  });

  public readonly development = this.config.development;

  public async getPrefix(guildId?: string): Promise<string> {
    if (guildId) {
      const customPrefix = await CustomPrefix.findOne({
        guildId: guildId,
      });

      if (customPrefix && customPrefix.prefix) return customPrefix.prefix;
    }

    return this.config.prefix;
  }

  public embed = (color?: ColorResolvable) =>
    new ExtendedEmbedBuilder(color || this.color.main);

  public button = () => new ExtendedButtonBuilder();

  public webhooks = Object.fromEntries(
    Object.entries(config.webhooks).map(([hook, url]) => [
      hook as keyof WebhookConfig,
      new WebhookClient({ url }),
    ])
  ) as { [key in keyof WebhookConfig]: WebhookClient };

  public async start(token: string): Promise<void> {
    await this.loadCommands();
    this.logger.info("[CLIENT] Successfully loaded commands!");
    await this.loadEvents();
    this.logger.info("[CLIENT] Successfully loaded events!");
    loadPlugins(this);

    if (config.database.connect === true) {
      await connectDatabase(this, config.database.uri, config.database.options);
    }

    await this.login(token);
  }

  private async loadCommands(): Promise<void> {
    const commandsPath = fs.readdirSync(path.join(__dirname, "../commands"));

    for (const dir of commandsPath) {
      const commandFiles = fs
        .readdirSync(path.join(__dirname, "../commands", dir))
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const cmdModule = require(`../commands/${dir}/${file}`);
        const command: Command = new cmdModule.default(this, file);
        command.category = dir;

        this.commands.set(command.name, command);
        command.aliases.forEach((alias: string) => {
          this.aliases.set(alias, command.name);
        });

        if (command.slashCommand) {
          const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
            name: command.name,
            description: command.description.content,
            type: ApplicationCommandType.ChatInput,
            options: command.options || [],
            default_member_permissions:
              Array.isArray(command.permissions.user) &&
              command.permissions.user.length > 0
                ? PermissionsBitField.resolve(
                    command.permissions.user as any
                  ).toString()
                : null,
            name_localizations: null,
            description_localizations: null,
          };

          this.body.push(data);
        }
      }
    }
  }

  public async deployCommands(guildId?: string): Promise<void> {
    const route = guildId
      ? Routes.applicationGuildCommands(this.user?.id ?? "", guildId)
      : Routes.applicationCommands(this.user?.id ?? "");

    try {
      const rest = new REST({ version: "10" }).setToken(
        this.config.token ?? ""
      );
      await rest.put(route, { body: this.body });
    } catch (error) {
      this.logger.error(error, this);
    }
  }

  private async loadEvents(): Promise<void> {
    const eventsPath = fs.readdirSync(path.join(__dirname, "..", "events"));

    for (const dir of eventsPath) {
      const eventFiles = fs
        .readdirSync(path.join(__dirname, "..", "events", dir))
        .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
        const eventModule = require(`../events/${dir}/${file}`);
        const event = new eventModule.default(this, file);

        this.on(event.name, (...args) => event.run(...args));
      }
    }
  }
}
