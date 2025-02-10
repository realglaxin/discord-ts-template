import { ExtendedEmbedBuilder } from "./Embed";
import { Context } from "../structures/index";
import { ExtendedButtonBuilder } from "./Button";
import { filterAuthor } from "./FilterAuthor";
import { ActionRowBuilder, CollectedInteraction } from "discord.js";

export const paginator = async (
  ctx: Context,
  pages: ExtendedEmbedBuilder[]
) => {
  const client = ctx.client;
  if (!ctx.author) return;

  if (pages.length === 1) {
    await ctx?.sendMessage({
      embeds: [pages[0]],
    });
    return;
  }

  let page = 0;
  const date = Date.now();

  const reply = await ctx?.sendMessage({
    embeds: [pages[page]],
    components: [
      new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
        client
          .button()
          .secondary(
            `first_${ctx.author.id}_${date}`,
            undefined,
            client.emoji.paginator.first
          ),
        client
          .button()
          .secondary(
            `previous_${ctx.author.id}_${date}`,
            undefined,
            client.emoji.paginator.previous
          ),
        client
          .button()
          .secondary(
            `next_${ctx.author.id}_${date}`,
            undefined,
            client.emoji.paginator.next
          ),
        client
          .button()
          .secondary(
            `last_${ctx.author.id}_${date}`,
            undefined,
            client.emoji.paginator.last
          )
      ),
    ],
  });

  if (!reply) return;

  const collector = reply.createMessageComponentCollector({
    time: 60000,
    filter: async (interaction: CollectedInteraction) =>
      await filterAuthor(interaction, ctx),
  });

  collector.on("collect", async (interaction: CollectedInteraction) => {
    await interaction.deferUpdate().catch(() => null);

    switch (interaction.customId) {
      case `first_${ctx.author?.id}_${date}`:
        page = 0;
        break;

      case `previous_${ctx.author?.id}_${date}`:
        page = page > 0 ? --page : pages.length - 1;
        break;

      case `next_${ctx.author?.id}_${date}`:
        page = page + 1 < pages.length ? ++page : 0;
        break;

      case `last_${ctx.author?.id}_${date}`:
        page = pages.length - 1;
        break;
    }

    await reply.edit({
      embeds: [pages[page]],
    });
  });

  collector.on("end", () => {
    reply
      .edit({
        components: [
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            client
              .button()
              .secondary(
                `first_${ctx.author?.id}_${date}`,
                undefined,
                client.emoji.paginator.first,
                true
              ),
            client
              .button()
              .secondary(
                `previous_${ctx.author?.id}_${date}`,
                undefined,
                client.emoji.paginator.previous,
                true
              ),
            client
              .button()
              .secondary(
                `next_${ctx.author?.id}_${date}`,
                undefined,
                client.emoji.paginator.next,
                true
              ),
            client
              .button()
              .secondary(
                `last_${ctx.author?.id}_${date}`,
                undefined,
                client.emoji.paginator.last,
                true
              )
          ),
        ],
      })
      .catch(() => null);
  });
  return;
};
