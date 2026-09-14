import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

  const roles = [
    "ADMIN",
    "CUSTOMER",
    "SUPER_ADMIN"
  ];

  for (const role of roles) {

    const exists = await knex("Roles")
      .where({ role_name: role })
      .first();

    if (!exists) {
      await knex("Roles").insert({
        role_name: role
      });
    }

  }
}