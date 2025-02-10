import chalk from "chalk";
import moment from "moment-timezone";
import { ExtendedClient } from "./index";

export type LogLevel = keyof typeof styles;

const styles = {
  info: { color: chalk.hex("#66ccff"), display: "INFO" },
  debug: { color: chalk.hex("#555555"), display: "DEBUG" },
  error: { color: chalk.hex("#ff2200"), display: "ERROR" },
  warn: { color: chalk.hex("#ffaa00"), display: "WARNING" },
  success: { color: chalk.hex("#77ee55"), display: "SUCCESS" },
  log: { color: chalk.hex("#ffffff"), display: "LOG" },
  start: { color: chalk.yellow, display: "READY" },
};

export default class Logger {
  private static logger(level: LogLevel, content: string) {
    const style = styles[level];

    console.log(
      `${chalk.grey(
        moment().tz("Asia/Karachi").format("DD-MM-YYYY hh:mm:ss")
      )} - ${style.color(style.display)} - ${chalk.white(content)}`
    );
  }

  static info(content: string) {
    this.logger("info", content);
  }

  static debug(content: string) {
    const sanitizedContent = content.replace(/\n/g, ",");
    this.logger("debug", sanitizedContent);
  }

  static error(content: any, client: ExtendedClient) {
    this.logger("error", content);
    client.webhooks.errorlogs.send({
      username: `error-logs`,
      avatarURL: `${client.user?.displayAvatarURL()}`,
      embeds: [client.embed(client.color.error).desc(content)],
    });
  }

  static warn(content: string) {
    this.logger("warn", content);
  }

  static success(content: string) {
    this.logger("success", content);
  }

  static log(content: string) {
    this.logger("log", content);
  }

  static start(content: string) {
    this.logger("start", content);
  }
}
