import { Event, type ExtendedClient } from "../../structures/index";

export default class Ready extends Event {
  constructor(client: ExtendedClient, file: string) {
    super(client, file, {
      name: "ready",
    });
  }

  public async run(): Promise<void> {
    this.client.logger.start(
      `[CLIENT] ${this.client.user?.tag} is ready and connected!`
    );

    if (this.client.development === true) {
      await this.client.deployCommands(this.client.config.guildId);
      this.client.logger.success(
        "[CLIENT] Slash commands has been deployed for development."
      );
    } else {
      await this.client.deployCommands();
      this.client.logger.success(
        "[CLIENT] Slash commands has been deployed globally."
      );
    }
  }
}
