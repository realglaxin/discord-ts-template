import type {
  APIApplicationCommandOption,
  PermissionResolvable,
} from "discord.js";
import type ExtendedClient from "./ExtendedClient";

interface CommandDescription {
  content: string;
  usage: string;
  examples: string[];
}

interface CommandPermissions {
  dev: boolean;
  client: string[] | PermissionResolvable;
  user: string[] | PermissionResolvable;
}

interface CommandOptions {
  name: string;
  name_localizations?: Record<string, string>;
  description?: Partial<CommandDescription>;
  description_localizations?: Record<string, string>;
  aliases?: string[];
  cooldown?: number;
  args?: boolean;
  permissions?: Partial<CommandPermissions>;
  slashCommand?: boolean;
  options?: APIApplicationCommandOption[];
  category?: string;
}

export default class Command {
  public client: ExtendedClient;
  public name: string;
  public name_localizations?: Record<string, string>;
  public description: CommandDescription;
  public description_localizations?: Record<string, string>;
  public aliases: string[];
  public cooldown: number;
  public args: boolean;
  public permissions: CommandPermissions;
  public slashCommand: boolean;
  public options: APIApplicationCommandOption[];
  public category: string;

  constructor(client: ExtendedClient, options: CommandOptions) {
    this.client = client;
    this.name = options.name;
    this.name_localizations = options.name_localizations ?? {};
    this.description = {
      content: options.description?.content ?? "No description provided",
      usage: options.description?.usage ?? "No usage provided",
      examples: options.description?.examples ?? ["No examples provided"],
    };
    this.description_localizations = options.description_localizations ?? {};
    this.aliases = options.aliases ?? [];
    this.cooldown = options.cooldown ?? 3;
    this.args = options.args ?? false;
    this.permissions = {
      dev: options.permissions?.dev ?? false,
      client: options.permissions?.client ?? [
        "SendMessages",
        "ReadMessageHistory",
        "ViewChannel",
        "EmbedLinks",
      ],
      user: options.permissions?.user ?? [],
    };
    this.slashCommand = options.slashCommand ?? false;
    this.options = options.options ?? [];
    this.category = options.category ?? "general";
  }

  public async run(
    _client: ExtendedClient,
    _message: any,
    _args: string[]
  ): Promise<any> {
    return await Promise.resolve();
  }
}
