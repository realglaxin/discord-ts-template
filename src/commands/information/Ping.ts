import {
  Command,
  type Context,
  type ExtendedClient,
} from "../../structures/index";
import { paginator } from "../../functions/Paginator";

export default class Ping extends Command {
  constructor(client: ExtendedClient) {
    super(client, {
      name: "ping",
      description: {
        content: "Check the bot's latency",
        examples: ["ping"],
        usage: "ping",
      },
      category: "information",
      aliases: ["latency"],
      cooldown: 5,
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ReadMessageHistory",
          "ViewChannel",
          "EmbedLinks",
        ],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }

  public async run(client: ExtendedClient, ctx: Context): Promise<any> {
    const pages = [
      this.client.embed().desc(`🏓 Pong! ${client.ws.ping}ms page 1`),
      this.client.embed().desc(`🏓 Pong! ${client.ws.ping}ms page 2`),
      this.client.embed().desc(`🏓 Pong! ${client.ws.ping}ms page 3`),
      this.client.embed().desc(`🏓 Pong! ${client.ws.ping}ms page 4`),
    ];

    paginator(ctx, pages);
  }
}
