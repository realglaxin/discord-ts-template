import { ActionRowBuilder, type Guild } from "discord.js";
import { Event, type ExtendedClient } from "../../structures/index";
import { ExtendedButtonBuilder } from "../../functions/Button";

export default class GuildCreate extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "guildCreate",
    });
  }

  public async run(guild: Guild): Promise<void> {
    if (!guild) return;

    try {
      const logs = await guild.fetchAuditLogs({ type: 28 }).catch(() => null);
      const addedBy =
        logs?.entries
          .filter((entry) => entry.target?.id === this.client.user!.id)
          .first()?.executor || null;

      const obj = {
        embeds: [
          this.client
            .embed()
            .author({
              name: `Thanks for choosing me!`,
              iconURL: this.client.user?.displayAvatarURL(),
            })
            .desc(
              `${this.client.emoji.success} **${
                this.client.user!.username +
                "**" +
                ` has been successfully added to \`${guild.name}\`.`
              }\n\n` +
                `> You can report any issues at my **[Support Server](${this.client.links.support})**. ` +
                `You can also reach out to my **[Developers](${this.client.links.support})** if you want to know more about me.`
            ),
        ],
        components: [
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            this.client
              .button()
              .link("Support Server", this.client.links.support)
          ),
        ],
      };

      await addedBy?.send(obj).catch(() => null);

      const owner = await guild.fetchOwner({ force: true }).catch(() => null);

      this.client.webhooks.guildlogs.send({
        username: "guild-logs",
        avatarURL: this.client.user?.displayAvatarURL(),
        embeds: [
          this.client
            .embed()
            .desc(
              `${this.client.emoji.plus} **${guild.name}** **(ID: \`${
                guild.id
              }\` :: Members: \`${
                guild.memberCount
              }\`)** has been added to my guilds, the owner of this server is **${
                owner?.user.username
              } (ID: \`${owner?.user.id}\`)** and i was added by **${
                addedBy?.username || "Unknown"
              } (ID: \`${addedBy?.id}\`)**.`
            ),
        ],
      });
    } catch (error) {
      this.client.logger.error(
        `Error sending message for ${guild.name ?? "Guild"}: ${error}`,
        this.client
      );
    }
  }
}
