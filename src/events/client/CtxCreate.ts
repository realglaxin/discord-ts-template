import {
  ActionRowBuilder,
  GuildChannel,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import { Context, Event, type ExtendedClient } from "../../structures/index";
import { ExtendedButtonBuilder } from "../../functions/Button";
import { checkCooldown } from "../../functions/Cooldown";
import { checkBlacklist } from "../../functions/FilterBlacklist";

export default class CtxCreate extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "ctxCreate",
    });
  }

  public async run(ctx: Context): Promise<any> {
    if (!(ctx.guild && ctx.guild.id)) return;
    if (!ctx.author) return;

    let command: any;
    if (ctx.isInteraction) {
      command = this.client.commands.get(
        ctx.interaction?.commandName as string
      );
    } else {
      command =
        this.client.commands.get(ctx.args.shift()?.toLowerCase()) ||
        this.client.commands.get(
          this.client.aliases.get(ctx.args.shift()?.toLowerCase()) as string
        );
    }

    if (!command) return;

    const clientMember = ctx.guild.members.resolve(this.client.user!)!;
    const isDev: boolean =
      ctx.author && this.client.config.owners?.includes(ctx.author.id)
        ? true
        : false;

    const blacklist =
      (await checkBlacklist("Guild", ctx.guild.id)) ||
      (await checkBlacklist("User", ctx.author.id));

    if (blacklist === true) return;

    if (
      !(
        ctx.inGuild &&
        (ctx.channel as GuildChannel)
          .permissionsFor(clientMember)
          ?.has(PermissionFlagsBits.ViewChannel)
      )
    )
      return;

    const requiredBotPermissions = [
      "SendMessages",
      "ReadMessageHistory",
      "ViewChannel",
      "EmbedLinks",
    ];

    const missingBotPermissions = requiredBotPermissions.filter(
      (perm: any) => !clientMember.permissions.has(perm)
    );

    if (missingBotPermissions.length > 0) {
      await ctx.author
        .send({
          embeds: [
            this.client
              .embed(this.client.color.error)
              .desc(
                `${this.client.emoji.error} I am missing ${missingBotPermissions
                  .map((perm) => `\`${perm}\``)
                  .join(", ")} permission(s) in ${ctx.channel}`
              ),
          ],
          components: [
            new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
              this.client
                .button()
                .link("Contact Support", this.client.links.support)
            ),
          ],
        })
        .catch(() => {
          null;
        });
      return;
    }

    if (
      this.client.development === true &&
      ctx.guild?.id !== this.client.config.guildId
    ) {
      await ctx.errorReply(
        "I am unavailable right now due to development mode."
      );
      return;
    }

    if (command.permissions) {
      if (command.permissions?.client) {
        const missingClientPermissions = command.permissions.client.filter(
          (perm: any) => !clientMember.permissions.has(perm)
        );

        if (missingClientPermissions.length > 0) {
          return await ctx.errorReply(
            `I am missing ${missingClientPermissions
              .map((perm: any) => `\`${perm}\``)
              .join(", ")} permission(s)`
          );
        }
      }

      if (command.permissions?.user) {
        if (
          !(
            isDev ||
            (ctx.member as GuildMember).permissions.has(
              command.permissions.user
            )
          )
        ) {
          const missingUserPermissions = command.permissions.user.filter(
            (perm: any) => !(ctx.member as GuildMember).permissions.has(perm)
          );

          return await ctx.errorReply(
            `You are missing ${missingUserPermissions
              .map((perm: any) => `\`${perm}\``)
              .join(", ")} permission(s)`
          );
        }
      }

      if (command.permissions?.dev && this.client.config.owners) {
        if (!isDev) {
          let sentMsg = await ctx.errorReply(
            "This command is restricted to my developer(s) only."
          );

          return setTimeout(() => {
            sentMsg.delete().catch(() => null);
          }, 3000);
        }
      }
    }

    if (!isDev) {
      if (await checkCooldown(ctx, command)) return;
    }

    if (!ctx.isInteraction) {
      if (ctx.args.includes("@everyone") || ctx.args.includes("@here")) {
        return await ctx.errorReply(
          "You cannot mention everyone/here in your message."
        );
      }
    }

    try {
      return command.run(this.client, ctx, ctx.args);
    } catch (error: any) {
      this.client.logger.error(error, this.client);
      return await ctx.errorReply(
        "There was an error while executing this command."
      );
    } finally {
      let slashOrPrefix = ctx.isInteraction ? "slash" : "prefix";

      await this.client.webhooks.cmdlogs.send({
        username: `cmd-logs`,
        avatarURL: this.client.user?.displayAvatarURL(),
        embeds: [
          this.client
            .embed()
            .desc(
              `${this.client.emoji.success} **${ctx.author.username}** ran the \`${command.name}\` ${slashOrPrefix} command in **${ctx.guild.name}** **(ID: \`${ctx.guild.id}\`)** within the **${ctx.channel}** channel.`
            ),
        ],
      });
    }
  }
}
