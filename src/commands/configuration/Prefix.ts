import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  CollectedInteraction,
} from "discord.js";
import {
  Command,
  type Context,
  type ExtendedClient,
} from "../../structures/index";
import CustomPrefix from "../../database/schemas/CustomPrefix";
import { ExtendedButtonBuilder } from "../../functions/Button";
import { filterAuthor } from "../../functions/FilterAuthor";

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
          description: "Set a new prefix for this server",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "prefix",
              description: "The new prefix for the server",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "reset",
          description: "Reset the server prefix to the default",
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
          return ctx.errorReply("Please provide a new prefix for the server.");
        }

        if (newPrefix.length > 5) {
          return ctx.errorReply(
            "The prefix cannot be longer than 5 characters."
          );
        }

        const prefixData = await CustomPrefix.findOne({
          guildId: ctx.guild.id,
        });

        if (prefixData && prefixData.prefix === newPrefix) {
          return ctx.errorReply(
            "The new prefix cannot be the same as the old one."
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

        const confirmDisabledRow =
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            this.client
              .button()
              .success("confirm", "Confirm", this.client.emoji.success, true),
            this.client
              .button()
              .danger("cancel", "Cancel", this.client.emoji.error, true)
          );

        const confirmEmbed = client
          .embed()
          .author({
            name: "Custom Prefix",
            iconURL: client.user?.displayAvatarURL(),
          })
          .desc(
            `${this.client.emoji.main} Are you sure you want to change the prefix to \`${newPrefix}\`?`
          )
          .footer({
            text: `Requested by ${ctx.author?.username}`,
            iconURL: ctx.author?.displayAvatarURL(),
          });

        const confirmMessage = await ctx.sendMessage({
          embeds: [confirmEmbed],
          components: [confirmRow],
        });

        const collector = confirmMessage.createMessageComponentCollector({
          filter: async (i: CollectedInteraction) => await filterAuthor(i, ctx),
          time: 30000,
        });

        collector.on("collect", async (interaction) => {
          await interaction.deferUpdate();

          switch (interaction.customId) {
            case "confirm": {
              const schema = await CustomPrefix.findOneAndUpdate(
                { guildId: ctx.guild.id },
                { prefix: newPrefix },
                { new: true }
              );

              if (!schema) {
                await CustomPrefix.create({
                  guildId: ctx.guild.id,
                  prefix: newPrefix,
                  manager: ctx.author?.id,
                });
              }

              const successEmbed = client
                .embed()
                .desc(
                  `${this.client.emoji.success} The prefix for this server has been updated to \`${newPrefix}\``
                );

              await interaction
                .editReply({
                  embeds: [successEmbed],
                  components: [],
                })
                .catch(() => {});

              collector.stop();
              break;
            }
            case "cancel": {
              const cancelEmbed = client
                .embed(this.client.color.error)
                .desc(
                  `${this.client.emoji.error} The prefix change has been cancelled.`
                );

              await interaction
                .editReply({
                  embeds: [cancelEmbed],
                  components: [confirmDisabledRow],
                })
                .catch(() => {});

              collector.stop();
              break;
            }
          }
        });

        collector.on("end", async (_collected, reason) => {
          if (reason === "time") {
            const timeoutEmbed = client
              .embed(this.client.color.error)
              .desc(
                `${this.client.emoji.error} The prefix change has been timed out.`
              );

            await confirmMessage
              .edit({
                embeds: [timeoutEmbed],
                components: [confirmDisabledRow],
              })
              .catch(() => {});

            collector.stop();
          }
        });

        break;
      }
      case "reset": {
        const prefixData = await CustomPrefix.findOne({
          guildId: ctx.guild.id,
        });

        if (!prefixData) {
          return ctx.errorReply(
            "The prefix is already set to the default prefix."
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

        const confirmDisabledRow =
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            this.client
              .button()
              .success("confirm", "Confirm", this.client.emoji.success, true),
            this.client
              .button()
              .danger("cancel", "Cancel", this.client.emoji.error, true)
          );

        const confirmEmbed = client
          .embed()
          .author({
            name: "Custom Prefix",
            iconURL: client.user?.displayAvatarURL(),
          })
          .desc(
            `${this.client.emoji.main} Are you sure you want to reset the prefix to the default?`
          )
          .footer({
            text: `Requested by ${ctx.author?.username}`,
            iconURL: ctx.author?.displayAvatarURL(),
          });

        const confirmMessage = await ctx.sendMessage({
          embeds: [confirmEmbed],
          components: [confirmRow],
        });

        const collector = confirmMessage.createMessageComponentCollector({
          filter: async (i: CollectedInteraction) => await filterAuthor(i, ctx),
          time: 30000,
        });

        collector.on("collect", async (interaction) => {
          await interaction.deferUpdate();

          switch (interaction.customId) {
            case "confirm": {
              await CustomPrefix.findOneAndDelete({
                guildId: ctx.guild.id,
              });

              const successEmbed = client
                .embed()
                .desc(
                  `${this.client.emoji.success} The prefix for this server has been reset to the default.`
                );

              await interaction
                .editReply({
                  embeds: [successEmbed],
                  components: [],
                })
                .catch(() => {});

              collector.stop();
              break;
            }
            case "cancel": {
              const cancelEmbed = client
                .embed(this.client.color.error)
                .desc(
                  `${this.client.emoji.error} The prefix reset has been cancelled.`
                );

              await interaction
                .editReply({
                  embeds: [cancelEmbed],
                  components: [confirmDisabledRow],
                })
                .catch(() => {});

              collector.stop();
              break;
            }
          }
        });

        collector.on("end", async (_collected, reason) => {
          if (reason === "time") {
            const timeoutEmbed = client
              .embed(this.client.color.error)
              .desc(
                `${this.client.emoji.error} The prefix reset has been timed out.`
              );

            await confirmMessage
              .edit({
                embeds: [timeoutEmbed],
                components: [confirmDisabledRow],
              })
              .catch(() => {});

            collector.stop();
          }
        });

        break;
      }
      default: {
        const prefix = await client.getPrefix(ctx.guild.id);

        const prefixEmbed = client
          .embed()
          .desc(
            `${this.client.emoji.main} The current prefix for this server is \`${prefix}\``
          );

        await ctx.sendMessage({
          embeds: [prefixEmbed],
        });

        break;
      }
    }
  }
}
