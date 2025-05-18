import {
  Command,
  type Context,
  type ExtendedClient,
} from "../../structures/index";
import GuildBlacklist from "../../database/schemas/GuildBlacklist";
import UserBlacklist from "../../database/schemas/UserBlacklist";
import { checkBlacklist } from "../../functions/FilterBlacklist";
import { paginator } from "../../functions/Paginator";

export default class Blacklist extends Command {
  constructor(client: ExtendedClient) {
    super(client, {
      name: "blacklist",
      description: {
        content: "Blacklist a user/guild from using the bot",
        examples: [
          "blacklist add <guild/user> <id>",
          "blacklist remove <guild/user> <id>",
          "blacklist list <guild/user>",
        ],
        usage: "blacklist <add/remove/list> <guild/user> <id>",
      },
      category: "developers",
      aliases: [],
      cooldown: 5,
      args: true,
      permissions: {
        dev: true,
        client: [
          "SendMessages",
          "ReadMessageHistory",
          "ViewChannel",
          "EmbedLinks",
        ],
        user: [],
      },
      slashCommand: false,
      options: [],
    });
  }

  public async run(
    client: ExtendedClient,
    ctx: Context,
    args: string[]
  ): Promise<any> {
    const subCommand: string | undefined = args[0];

    switch (subCommand) {
      case "add": {
        const type: string | undefined = args[1];
        const id: string | undefined = args[2];

        if (!id) return ctx.errorReply("Please provide a valid guild/user ID.");

        switch (type) {
          case "guild": {
            const blacklist = await checkBlacklist("Guild", id);

            if (blacklist)
              return ctx.errorReply("This guild is already in the blacklist.");

            const guildBlacklist = new GuildBlacklist({
              guildId: id,
              manager: ctx.author?.id,
            });
            await guildBlacklist.save();

            const embed = client
              .embed()
              .desc(
                `${this.client.emoji.success} Successfully added the guild to the blacklist.`
              );

            ctx.sendMessage({
              embeds: [embed],
            });

            break;
          }
          case "user": {
            const blacklist = await checkBlacklist("User", id);

            if (blacklist)
              return ctx.errorReply("This user is already in the blacklist.");

            const userBlacklist = new UserBlacklist({
              userId: id,
              manager: ctx.author?.id,
            });
            await userBlacklist.save();

            const embed = client
              .embed()
              .desc(
                `${this.client.emoji.success} Successfully added the user to the blacklist.`
              );

            ctx.sendMessage({
              embeds: [embed],
            });

            break;
          }
        }

        break;
      }
      case "remove": {
        const type: string | undefined = args[1];
        const id: string | undefined = args[2];

        if (!id) return ctx.errorReply("Please provide a valid guild/user ID.");

        switch (type) {
          case "guild": {
            const blacklist = await checkBlacklist("Guild", id);

            if (!blacklist)
              return ctx.errorReply("This guild is not in the blacklist.");

            await GuildBlacklist.deleteOne({
              guildId: id,
            });

            const embed = client
              .embed()
              .desc(
                `${this.client.emoji.success} Successfully removed the guild from the blacklist.`
              );

            ctx.sendMessage({
              embeds: [embed],
            });

            break;
          }
          case "user": {
            const blacklist = await checkBlacklist("User", id);

            if (!blacklist)
              return ctx.errorReply("This user is not in the blacklist.");

            await UserBlacklist.deleteOne({
              userId: id,
            });

            const embed = client
              .embed()
              .desc(
                `${this.client.emoji.success} Successfully removed the user from the blacklist.`
              );

            ctx.sendMessage({
              embeds: [embed],
            });

            break;
          }
        }

        break;
      }
      case "list": {
        const type: string | undefined = args[1];

        switch (type) {
          case "guild": {
            const guildBlacklist = await GuildBlacklist.find();

            if (!guildBlacklist || guildBlacklist.length === 0)
              return ctx.errorReply("There are no guilds in the blacklist.");

            const pages = [];

            for (let i = 0; i < guildBlacklist.length; i += 5) {
              const guilds = guildBlacklist.slice(i, i + 5);

              const embed = client
                .embed()
                .author({
                  name: "Guild Blacklist",
                  iconURL: client.user?.displayAvatarURL(),
                })
                .desc(
                  `${guilds
                    .map(
                      (g, idx) =>
                        `${this.client.emoji.main} ${i + idx + 1}. ${
                          g.guildId
                        } - <@${g.manager}>`
                    )
                    .join("\n")}`
                )
                .footer({
                  text: `Requested by ${ctx.author?.username}`,
                  iconURL: ctx.author?.displayAvatarURL(),
                });

              pages.push(embed);
            }

            paginator(ctx, pages);

            break;
          }
          case "user": {
            const userBlacklist = await UserBlacklist.find();

            if (!userBlacklist || userBlacklist.length === 0)
              return ctx.errorReply("There are no users in the blacklist.");

            const pages = [];

            for (let i = 0; i < userBlacklist.length; i += 5) {
              const users = userBlacklist.slice(i, i + 5);

              const embed = client
                .embed()
                .author({
                  name: "User Blacklist",
                  iconURL: client.user?.displayAvatarURL(),
                })
                .desc(
                  `${users
                    .map(
                      (u, idx) =>
                        `${this.client.emoji.main} ${i + idx + 1}. ${
                          u.userId
                        } - <@${u.manager}>`
                    )
                    .join("\n")}`
                )
                .footer({
                  text: `Requested by ${ctx.author?.username}`,
                  iconURL: ctx.author?.displayAvatarURL(),
                });

              pages.push(embed);
            }

            paginator(ctx, pages);

            break;
          }
        }

        break;
      }
      default: {
        const embed = client
          .embed()
          .desc(
            `${this.client.emoji.main} Usage: \`blacklist <add/remove/list> <guild/user> <id>\``
          );

        ctx.sendMessage({
          embeds: [embed],
        });

        break;
      }
    }
  }
}
