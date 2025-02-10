import { type Message } from "discord.js";
import { Context, Event, type ExtendedClient } from "../../structures/index";
import NoPrefix from "../../database/schemas/NoPrefix";

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

    const noPrefixUser: boolean = (await NoPrefix.findOne({
      userId: message.author.id,
    }))
      ? true
      : false;

    const clientPrefix = await this.client.getPrefix(message.guild.id);

    const prefix =
      noPrefixUser && !message.content.startsWith(clientPrefix)
        ? ""
        : clientPrefix;

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
