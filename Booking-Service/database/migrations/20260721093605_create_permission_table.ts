import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("permissions", (table) => {
    table.increments("permission_id").primary();

    table
      .string("permission_name", 100)
      .notNullable()
      .unique();

    table
      .string("description", 255)
      .nullable();

    table
      .timestamp("created_at")
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("permissions");
}