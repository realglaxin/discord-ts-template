import {
  EmbedBuilder,
  ColorResolvable,
  EmbedFooterOptions,
  EmbedAuthorOptions,
  APIEmbedField,
} from "discord.js";

export class ExtendedEmbedBuilder extends EmbedBuilder {
  constructor(color: ColorResolvable) {
    super();
    this.setColor(color);
  }
  img = (uri: string) => this.setImage(uri);
  title = (title: string) => this.setTitle(title);
  author = (op: EmbedAuthorOptions) => this.setAuthor(op);
  thumb = (uri: string) => this.setThumbnail(uri);
  desc = (text: string) => this.setDescription(text);
  fields = (op: APIEmbedField) => this.addFields(op);
  footer = (op: EmbedFooterOptions) => this.setFooter(op);
  timestamp = (op?: number | Date) => this.setTimestamp(op || null);
}
