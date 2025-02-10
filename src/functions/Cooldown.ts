import { Collection } from "discord.js";
import { fromMs } from "./ms/FromMs";
import { RateLimitManager } from "@sapphire/ratelimits";
import { Context, Command } from "../structures/index";
import { limited } from "./Ratelimiter";

const cooldownRateLimitManager = new RateLimitManager(5000);

export const checkCooldown = async (ctx: Context, command: Command) => {
  const client = ctx.client;
  if (!ctx.author) return;

  if (limited(ctx.author.id)) return true;

  if (!client.cooldown.has(command.name)) {
    client.cooldown.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldown.get(command.name);
  const cooldownAmount = command.cooldown * 1000 || 5_000;

  if (timestamps.has(ctx.author.id)) {
    const expirationTime = timestamps.get(ctx.author.id)! + cooldownAmount;

    if (now < expirationTime) {
      const remainingTime = expirationTime - now;
      const cooldownRlBucket = cooldownRateLimitManager.acquire(
        `${ctx.author.id}_${command.name}`
      );
      if (cooldownRlBucket.limited) return true;
      try {
        cooldownRlBucket.consume();
      } catch {
        null;
      }

      let cooldownMsg = await ctx.errorReply(
        `Please wait ${fromMs(
          remainingTime
        )} more second(s) before reusing this command.`
      );

      setTimeout(() => {
        cooldownMsg.delete().catch(() => null);
      }, remainingTime);

      return true;
    }
  }

  timestamps.set(ctx.author.id, now);
  setTimeout(() => timestamps.delete(ctx.author?.id), cooldownAmount);
  return false;
};
