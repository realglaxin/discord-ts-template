import { Schema, SchemaTypes, model } from "mongoose";

export default model(
  "CustomPrefix",
  new Schema({
    guildId: {
      type: SchemaTypes.String,
      required: true,
    },
    prefix: {
      type: SchemaTypes.String,
      required: true,
    },
    manager: {
      type: SchemaTypes.String,
    },
  })
);
