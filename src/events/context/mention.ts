import { ActionRowBuilder, ChannelType, type Message } from "discord.js";
import { Event, type ExtendedClient } from "../../structures/index";
import { limited } from "../../functions/Ratelimiter";
import { ExtendedButtonBuilder } from "../../functions/Button";

export default class Mention extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "mention",
    });
  }

  public async run(message: Message): Promise<void> {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!this.client.user) return;
    if (!message.mentions.users.has(this.client.user!.id)) return;
    if (message.channel.type !== ChannelType.GuildText) return;
    if (limited(message.author.id)) return;

    const prefix = await this.client.getPrefix(message.guild.id);

    await message.reply({
      embeds: [
        this.client
          .embed()
          .author({
            name: this.client.user.displayName,
            iconURL: this.client.user.displayAvatarURL(),
          })
          .desc(
            `> ${this.client.config.description}\n\n${this.client.emoji.plus} [Invite Me To Your Server](${this.client.links.invite})\n${this.client.emoji.link} [Join My Support Server](${this.client.links.support})\n\n-# ${this.client.emoji.slash} My Prefix In This Server Is \`${prefix}\``
          ),
      ],
      components: [
        new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
          this.client.button().link("Invite Me", this.client.links.invite),
          this.client.button().link("Support Server", this.client.links.support)
        ),
      ],
    });
    return;
  }
}
