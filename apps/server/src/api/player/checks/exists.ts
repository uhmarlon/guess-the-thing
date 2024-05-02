import { db } from "../../../db";
import { eq } from "drizzle-orm";
import { users } from "../../../db/schema";
class UserExists {
  public async checkUserExists(userId: string): Promise<boolean> {
    const data = await db.select().from(users).where(eq(users.id, userId));
    return data.length > 0;
  }
}
export { UserExists };
