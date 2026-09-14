import { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  const existingAdmin = await knex("users")
    .where({ email: "admin@gmail.com" })
    .first();

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("12345", 10);

    await knex("users").insert({
      email: "admin@gmail.com",
      password_hash: passwordHash,
      role_id: 3, // SUPER_ADMIN
    });
  }
}