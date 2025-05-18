import { ActivityType, PresenceData, PresenceUpdateStatus } from "discord.js";
import { ConnectOptions } from "mongoose";

export default {
  client: {
    token: "",
    clientId: "",
    clientSecret: "",
    guildId: "",
    logChannelId: "",
    botName: "",
    owners: [""],
    presence: {
      activities: [
        {
          name: "",
          type: ActivityType.Playing,
        },
      ],
      status: PresenceUpdateStatus.Online,
    } as PresenceData,
    development: true,
    description: "",
  },
  commands: {
    prefix: "",
    message_commands: true,
    application_commands: {
      chat_input: true,
    },
  },
  database: {
    uri: "",
    options: {
      retryWrites: true,
      w: "majority",
      appName: "",
      dbName: "",
    } as ConnectOptions,
    connect: true,
  },
  color: {
    main: 0x00ff00,
    error: 0xff0000,
  },
  links: {
    invite: "",
    support: "",
  },
  webhooks: {
    cmdlogs: "",
    guildlogs: "",
    errorlogs: "",
  },
  emojis: {
    main: "",
    success: "",
    error: "",
    warn: "",
    slash: "",
    plus: "",
    link: "",
    paginator: {
      first: "",
      previous: "",
      next: "",
      last: "",
    },
  },
};
