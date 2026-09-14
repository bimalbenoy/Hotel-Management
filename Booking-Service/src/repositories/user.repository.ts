import db from "../config/db";

export class UserRepository {
  async findByEmail(email: string) {
    const user = await db("users")
      .where({ email })
      .first();

    return user;
  }
  async createUser(
    roleId: number,
    email: string,
    passwordHash: string
  ) {
    const [user] = await db("users")
      .insert({
        role_id: roleId,
        email,
        password_hash: passwordHash,
      })
      .returning("*");

    return user;
  }
  async reactivateUser(
    userId: number,
    passwordHash: string
  ) {
    const [user] = await db("users")
      .where({ user_id: userId })
      .update({
        password_hash: passwordHash,
        isDeleted: false,
      })
      .returning("*");
      return user;
}
  async getAllUsers() {

    return await db("users")
      .select(
        "user_id",
        "email",
        "role_id",
        "created_at",
        "isDeleted"
      );

  }
  async disableUser(userId: number){
    const [user] = await db("users")
      .where({ user_id: userId })
      .update({
        isDeleted: true,
      })
      .returning("*");
      return user;
  }
  async findById(userId: number) {

  const user = await db("users")
    .where({ user_id: userId })
    .first();

  return user;

}
}