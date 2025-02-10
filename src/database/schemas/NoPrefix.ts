import { Schema, SchemaTypes, model } from "mongoose";

export default model(
  "NoPrefix",
  new Schema({
    userId: {
      type: SchemaTypes.String,
      required: true,
    },
    manager: {
      id: SchemaTypes.String,
    },
  })
);
