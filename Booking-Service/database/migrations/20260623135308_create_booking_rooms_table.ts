import { Knex } from "knex";

export async function up(
  knex: Knex
): Promise<void> {

  await knex.schema.createTable(
    "booking_rooms",
    (table) => {

      table.increments("booking_room_id")
        .primary();

      table.integer("booking_id")
        .notNullable();

      table.integer("room_id")
        .notNullable();

      table.foreign("booking_id")
        .references("booking_id")
        .inTable("bookings");

      table.foreign("room_id")
        .references("room_id")
        .inTable("rooms");
    }
  );
}

export async function down(
  knex: Knex
): Promise<void> {

  await knex.schema.dropTableIfExists(
    "booking_rooms"
  );
}