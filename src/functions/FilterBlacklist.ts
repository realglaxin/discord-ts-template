import GuildBlacklist from "../database/schemas/GuildBlacklist";
import UserBlacklist from "../database/schemas/UserBlacklist";

type BlacklistType = "Guild" | "User";

export const checkBlacklist = async (
  type: BlacklistType,
  id: string
): Promise<boolean> => {
  if (type === "Guild") {
    const data = await GuildBlacklist.findOne({
      guildId: id,
    });

    if (data && data.guildId) return true;
  } else {
    const data = await UserBlacklist.findOne({
      userId: id,
    });

    if (data && data.userId) return true;
  }

  return false;
};
