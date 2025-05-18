import { ActionRowBuilder, CollectedInteraction } from "discord.js";
import { Context, ExtendedClient } from "../structures/index";
import { ExtendedButtonBuilder } from "./Button";

export const filterAuthor = async (
  interaction: CollectedInteraction,
  ctx: Context
) => {
  const client = interaction.client as ExtendedClient;

  if (interaction.user.id === ctx.author?.id) return true;

  const embed = client
    .embed(client.color.error)
    .desc(
      `${client.emoji.error} You are not allowed to interact with this message.`
    );

  const actionRow = new ActionRowBuilder<ExtendedButtonBuilder>().addComponents(
    client.button().link("Contact Support", client.links.support)
  );

  await interaction.reply({
    embeds: [embed],
    components: [actionRow],
    ephemeral: true,
  });

  return false;
};
