import {
  Command,
  type Context,
  type ExtendedClient,
} from "../../structures/index";

export default class Ping extends Command {
  constructor(client: ExtendedClient) {
    super(client, {
      name: "ping",
      description: {
        content: "Check the bot's latency information.",
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
    const apiLatency = client.ws.ping;
    const start = Date.now();
    await client.database?.admin().ping();
    const databaseLatency = Date.now() - start;

    const createdTimestamp = ctx.isInteraction
      ? ctx.interaction?.createdTimestamp
      : ctx.message?.createdTimestamp;

    const responseTime = createdTimestamp ? Date.now() - createdTimestamp : 0;

    const cpuUsage =
      (
        (process.cpuUsage().user + process.cpuUsage().system) /
        1000 /
        100
      ).toFixed(2) + "%";
    const memoryUsage = `${Math.round(
      process.memoryUsage().heapUsed / 1024 / 1024
    )}MB`;
    const platform = process.platform;

    const descArr = [
      `**Latency Details**`,
      `> -# **API Latency**: \`${apiLatency}ms\``,
      `> -# **Database Latency**: \`${databaseLatency}ms\``,
      `> -# **Response Time**: \`${responseTime}ms\``,
      `**System Details**`,
      `> -# **CPU Usage**: \`${cpuUsage}\``,
      `> -# **Memory Usage**: \`${memoryUsage}\``,
      `> -# **Platform**: \`${platform}\``,
    ];

    const embed = this.client
      .embed()
      .author({
        name: `Bot Latency`,
        iconURL: this.client.user?.displayAvatarURL(),
      })
      .desc(descArr.join("\n"));

    ctx.sendMessage({
      embeds: [embed],
    });
  }
}
