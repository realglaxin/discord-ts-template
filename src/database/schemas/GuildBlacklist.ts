import { Schema, SchemaTypes, model } from "mongoose";

export default model(
  "GuildBlacklist",
  new Schema({
    guildId: {
      type: SchemaTypes.String,
      required: true,
    },
    manager: {
      id: SchemaTypes.String,
    },
  })
);
