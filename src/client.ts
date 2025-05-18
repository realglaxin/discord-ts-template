import { type ClientOptions, GatewayIntentBits, Partials } from "discord.js";
import config from "./config";
import ExtendedClient from "./structures/ExtendedClient";
import { getInfo } from "discord-hybrid-sharding";

const options: ClientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  allowedMentions: { parse: ["users", "roles"], repliedUser: false },
  shards: getInfo().SHARD_LIST,
  shardCount: getInfo().TOTAL_SHARDS,
  failIfNotExists: false,
  sweepers: {
    users: {
      filter: () => (user) => user.id !== config.client.clientId,
      interval: parseInt("3_600"),
    },
    guildMembers: {
      filter: () => (member) => member.id !== config.client.clientId,
      interval: parseInt("3_600"),
    },
  },
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember,
    Partials.Reaction,
  ],
};

const client = new ExtendedClient(options);
client.start(config.client.token);
