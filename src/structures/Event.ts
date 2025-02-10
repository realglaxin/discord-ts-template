import type { ClientEvents, Message } from "discord.js";
import type ExtendedClient from "./ExtendedClient";
import Context from "./Context";

interface CustomClientEvents {
  ctxCreate: (ctx: Context) => any;
}

interface ContextEvents {
  mention: (msg: Message) => void;
}

export type AllEvents = ClientEvents & CustomClientEvents & ContextEvents;

interface EventOptions {
  name: keyof AllEvents;
  one?: boolean;
}

export default class Event {
  public client: ExtendedClient;
  public one: boolean;
  public file: string;
  public name: keyof AllEvents;
  public fileName: string;

  constructor(client: ExtendedClient, file: string, options: EventOptions) {
    this.client = client;
    this.file = file;
    this.name = options.name;
    this.one = options.one ?? false;
    this.fileName = file.split(".")[0];
  }

  public async run(..._args: any): Promise<void> {
    return await Promise.resolve();
  }
}
