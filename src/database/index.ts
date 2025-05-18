import mongoose, { ConnectOptions } from "mongoose";
import logger from "../structures/Logger";
import { ExtendedClient } from "../structures/index";

export default async function connectDatabase(
  client: ExtendedClient,
  uri: string,
  options: ConnectOptions
): Promise<mongoose.mongo.Db | undefined> {
  await mongoose
    .connect(uri, options)
    .then(() => {
      logger.success("[MongoDB] Connected to the database successfully.");
      return mongoose.connection.db;
    })
    .catch((err) => {
      logger.error(
        `[MongoDB] Error connecting to the database: ${err}`,
        client
      );
    });

  return undefined;
}
