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

  const createButton = (id: string, emoji: string, disabled: boolean) =>
    client
      .button()
      .secondary(`${id}_${ctx.author?.id}_${date}`, undefined, emoji, disabled);

  const createButtonRow = () => {
    const isFirstPage = page === 0;
    const isLastPage = page === pages.length - 1;

    return new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
      createButton("first", client.emoji.paginator.first, isFirstPage),
      createButton("previous", client.emoji.paginator.previous, isFirstPage),
      createButton("next", client.emoji.paginator.next, isLastPage),
      createButton("last", client.emoji.paginator.last, isLastPage)
    );
  };

  const updateMessage = async () => {
    await reply?.edit({
      embeds: [pages[page]],
      components: [createButtonRow()],
    });
  };

  const reply = await ctx?.sendMessage({
    embeds: [pages[page]],
    components: [createButtonRow()],
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
        page = page > 0 ? page - 1 : pages.length - 1;
        break;
      case `next_${ctx.author?.id}_${date}`:
        page = (page + 1) % pages.length;
        break;
      case `last_${ctx.author?.id}_${date}`:
        page = pages.length - 1;
        break;
    }

    await updateMessage();
  });

  collector.on("end", () => {
    reply
      .edit({
        components: [
          new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
            createButton("first", client.emoji.paginator.first, true),
            createButton("previous", client.emoji.paginator.previous, true),
            createButton("next", client.emoji.paginator.next, true),
            createButton("last", client.emoji.paginator.last, true)
          ),
        ],
      })
      .catch(() => null);
  });
};
