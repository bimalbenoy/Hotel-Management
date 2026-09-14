import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("role_permissions", (table) => {
    table.increments("role_permission_id").primary();

    table
      .integer("role_id")
      .unsigned()
      .notNullable()
      .references("role_id")
      .inTable("roles")
      .onDelete("CASCADE");

    table
      .integer("permission_id")
      .unsigned()
      .notNullable()
      .references("permission_id")
      .inTable("permissions")
      .onDelete("CASCADE");

    table
      .timestamp("created_at")
      .defaultTo(knex.fn.now());

    // Prevent pair duplicate 
    table.unique(["role_id", "permission_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("role_permissions");
}