import { ActivityType, PresenceData, PresenceUpdateStatus } from "discord.js";
import { ConnectOptions } from "mongoose";

export default {
  client: {
    token:
      "MTI4NTg4MTg1MTUzNzI2MDU3NA.G510_B.wcK4wV9M1Az96_2PQ-M9wimx40Qd7mckXP8ea4",
    clientId: "1285881851537260574",
    clientSecret: "-S9Ho4sHwhz9dmz30znf-hQGsH48bRQO",
    guildId: "1282946177687490613",
    logChannelId: "1284810415284551734",
    botName: "Glaxin testing",
    prefix: "-",
    owners: ["620569922870837253"],
    presence: {
      activities: [
        {
          name: "Made by Glaxin",
          type: ActivityType.Playing,
        },
      ],
      status: PresenceUpdateStatus.Online,
    } as PresenceData,
    development: true,
    description:
      "Lorem ipsum dolor sit amet. Aut cumque autem non nulla molestias ex sunt repellendus qui facere reprehenderit et eius impedit et quia inventore eos harum eius. Ea adipisci sunt qui possimus veniam eum rerum libero et corporis officia.",
  },
  database: {
    uri: "mongodb://152.67.10.153:25568/testbot",
    options: {
      retryWrites: true,
      w: "majority",
      appName: "testbot",
      dbName: "discordts",
    } as ConnectOptions,
    connect: true,
  },
  color: {
    main: 0x00ff00,
    error: 0xff0000,
  },
  links: {
    invite:
      "https://discord.com/api/oauth2/authorize?client_id=1284810415284551734&permissions=8&scope=bot",
    support: "https://discord.gg/invite",
  },
  webhooks: {
    cmdlogs:
      "https://discord.com/api/webhooks/1307608746608033834/YGW06axHLP9b_M3yinrIVxdpBtaj-Qwzt8ymjGJv16hrltoZyeEhYV7B68rC9GUol6LK",
    guildlogs:
      "https://discord.com/api/webhooks/1307608939516395541/MxueEpIp0GSUHQ0oESbZsUA6DLveBrNo2IQPc95gfcq2iANcnCa35Dw2j44t_icrTNb_",
    errorlogs:
      "https://discord.com/api/webhooks/1307609017497030657/at7bvDA-QoX7wM_TDwRw1hqhIRcnhJonxKswVJO2vJwAWMXHPyw8v0uEC8U4WX55qNL2",
  },
  emojis: {
    success: "✅",
    error: "❌",
    warn: "⚠️",
    slash: "<:slash:1314189659676348436>",
    plus: "<:plus:1314189168322285568>",
    link: "<:linkk:1314188968434208848>",
    paginator: {
      first: "⏮️",
      previous: "◀️",
      next: "▶️",
      last: "⏭️",
    },
  },
};
