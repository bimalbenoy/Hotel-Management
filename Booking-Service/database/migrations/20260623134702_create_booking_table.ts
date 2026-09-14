import { Knex } from "knex";

export async function up(
  knex: Knex
): Promise<void> {

  await knex.schema.createTable(
    "bookings",
    (table) => {

      table.increments("booking_id")
        .primary();

      table.integer("user_id")
        .notNullable();

      table.date("check_in")
        .notNullable();

      table.date("check_out")
        .notNullable();

      table.string("status", 20)
        .notNullable()
        .defaultTo("PENDING");

      table.timestamp("created_at")
        .defaultTo(knex.fn.now());

      table
        .foreign("user_id")
        .references("user_id")
        .inTable("users");
    }
  );
}

export async function down(
  knex: Knex
): Promise<void> {

  await knex.schema.dropTableIfExists(
    "bookings"
  );
}