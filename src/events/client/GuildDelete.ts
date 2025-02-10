import { type Guild } from "discord.js";
import { Event, type ExtendedClient } from "../../structures/index";

export default class GuildDelete extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "guildDelete",
    });
  }

  public async run(guild: Guild): Promise<void> {
    if (!guild) return;
    const owner = await this.client.users
      .fetch(guild.ownerId)
      .catch(() => null);

    try {
      this.client.webhooks.guildlogs.send({
        username: "guild-logs",
        avatarURL: this.client.user?.displayAvatarURL(),
        embeds: [
          this.client
            .embed()
            .desc(
              `${this.client.emoji.warn} **${guild.name}** **(ID: \`${
                guild.id
              }\` :: Members: \`${
                guild.memberCount
              }\`)** has been removed from my guilds, the owner of this server was **${
                owner?.username || "Unknown"
              } (ID: \`${guild.ownerId}\`)**.`
            ),
        ],
      });
    } catch (error) {
      this.client.logger.error(
        `Error in GuildDelete event: ${error}`,
        this.client
      );
    }
  }
}
