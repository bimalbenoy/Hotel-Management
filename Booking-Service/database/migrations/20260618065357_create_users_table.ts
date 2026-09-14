import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();

    table.integer("role_id").unsigned().notNullable();

    table.string("email", 100).notNullable().unique();

    table.string("password_hash", 255).notNullable();

    table.timestamp("created_at")
      .defaultTo(knex.fn.now());

    table
      .foreign("role_id")
      .references("role_id")
      .inTable("roles")
      .onDelete("NO ACTION");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}