import { CommandInteraction } from "discord.js";
import { Context, Event, type ExtendedClient } from "../../structures/index";
import config from "../../config";

export default class InteractionCreate extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "interactionCreate",
    });
  }

  public async run(interaction: CommandInteraction): Promise<any> {
    if (!interaction.isCommand()) return;
    if (interaction.user.bot) return;

    if (
      !config.commands.application_commands.chat_input &&
      interaction.isChatInputCommand()
    )
      return;

    const context = new Context(
      interaction as any,
      interaction.options.data as any
    );
    context.setArgs(interaction.options.data as any);

    return this.client.emit("ctxCreate", context);
  }
}
