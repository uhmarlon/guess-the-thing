import { db } from "../../../db";
import { eq } from "drizzle-orm";
import { users, userLevels } from "../../../db/schema";
import { LevelSystem } from "../level/levelsystem";
class UserExists {
  public async checkUserExists(userId: string): Promise<boolean> {
    const data = await db.select().from(users).where(eq(users.id, userId));
    return data.length > 0;
  }
  public async getUserLevel(userId: string): Promise<number> {
    const exists = await this.checkUserExists(userId);
    if (!exists) {
      return 0;
    }
    const data = await db
      .select()
      .from(userLevels)
      .where(eq(userLevels.userId, userId));
    if (data.length === 0) {
      return 0;
    }
    const level = LevelSystem.getLevelInfo(data[0].levelpoints);
    return level.currentLevel;
  }
}
export { UserExists };
