import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("rooms", (table) => {
    table.increments("room_id").primary();

    table.string("room_number", 20)
      .notNullable()
      .unique();

    table.integer("room_types_id")
      .notNullable();

    table.string("status", 20)
      .notNullable()
      .defaultTo("AVAILABLE");

    table.timestamp("created_at")
      .defaultTo(knex.fn.now());

    table
      .foreign("room_types_id")
      .references("room_types_id")
      .inTable("room_types");
  });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("rooms");
}

