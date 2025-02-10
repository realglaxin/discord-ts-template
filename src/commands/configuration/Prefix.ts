import { ActionRowBuilder, ApplicationCommandOptionType } from "discord.js";
import {
  Command,
  type Context,
  type ExtendedClient,
} from "../../structures/index";
import CustomPrefix from "../../database/schemas/CustomPrefix";
import { ExtendedButtonBuilder } from "../../functions/Button";

export default class Prefix extends Command {
  constructor(client: ExtendedClient) {
    super(client, {
      name: "prefix",
      description: {
        content: "Change or reset the bot's prefix!",
        examples: ["prefix set !", "prefix reset"],
        usage: "prefix set <new prefix>",
      },
      category: "configuration",
      aliases: ["pf"],
      cooldown: 5,
      args: true,
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ReadMessageHistory",
          "ViewChannel",
          "EmbedLinks",
        ],
        user: ["ManageGuild"],
      },
      slashCommand: true,
      options: [
        {
          name: "set",
          description: "Set a new prefix for this server!",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "prefix",
              description: "The new prefix for this server!",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "reset",
          description: "Resets the server prefix to default!",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    });
  }

  public async run(
    client: ExtendedClient,
    ctx: Context,
    args: string[]
  ): Promise<any> {
    let subCommand: string | undefined;

    if (ctx.isInteraction) {
      subCommand = ctx.options.getSubCommand();
    } else {
      subCommand = args[0];
    }

    switch (subCommand) {
      case "set": {
        let newPrefix: string | undefined;

        if (ctx.isInteraction) {
          newPrefix = ctx.options.get("prefix")?.value?.toString();
        } else {
          newPrefix = args[1];
        }

        if (!newPrefix) {
          return ctx.errorReply("Please provide a new prefix for the server!");
        }

        if (newPrefix.length > 5) {
          return ctx.errorReply(
            "The prefix cannot be longer than 5 characters!"
          );
        }

        const prefixData = await CustomPrefix.findOne({
          guildId: ctx.guild.id,
        });

        if (prefixData && prefixData.prefix === newPrefix) {
          return ctx.errorReply(
            "The new prefix cannot be the same as the old one!"
          );
        }

        const confirmRow =
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            this.client
              .button()
              .success("confirm", "Confirm", this.client.emoji.success),
            this.client
              .button()
              .danger("cancel", "Cancel", this.client.emoji.error)
          );

        const confirmEmbed = client
          .embed()
          .author({
            name: "Custom Prefix",
            iconURL: client.user?.displayAvatarURL(),
          })
          .desc(
            `${this.client.emoji.success} Are you sure you want to change the prefix to \`${newPrefix}\`?`
          )
          .footer({
            text: `Requested by ${ctx.author?.tag}`,
            iconURL: ctx.author?.displayAvatarURL(),
          });

        break;
      }
      case "reset": {
        break;
      }
      default: {
        break;
      }
    }
  }
}
