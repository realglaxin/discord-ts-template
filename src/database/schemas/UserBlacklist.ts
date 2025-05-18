import { Schema, SchemaTypes, model } from "mongoose";

export default model(
  "UserBlacklist",
  new Schema({
    userId: {
      type: SchemaTypes.String,
      required: true,
    },
    manager: {
      type: SchemaTypes.String,
    },
  })
);
