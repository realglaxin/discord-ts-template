import { type Message } from "discord.js";
import { Context, Event, type ExtendedClient } from "../../structures/index";
import config from "../../config";

export default class MessageCreate extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "messageCreate",
    });
  }

  public async run(message: Message): Promise<any> {
    if (message.author?.bot) return;
    if (!message.guild) return;

    if (message.mentions.users.has(this.client.user?.id as string)) {
      return this.client.emit("mention", message);
    }

    if (!config.commands.message_commands) return;

    const prefix = await this.client.getPrefix(message.guild.id);

    const escapeRegex = (str: string): string =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(
      `^(<@!?${this.client.user?.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const match = message.content.match(prefixRegex);
    if (!match) return;
    const [matchedPrefix] = match;

    const args = message.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/g);

    const context = new Context(message, args);
    context.setArgs(args);

    await this.client.dokdo.run(message);
    return this.client.emit("ctxCreate", context);
  }
}
