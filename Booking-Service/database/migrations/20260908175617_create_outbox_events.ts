import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("outbox_events", (table) => {
    table.increments("event_id").primary();

    table.string("event_type", 100).notNullable();

    table.string("aggregate_id", 100).notNullable();

    table.text("payload").notNullable();

    table.string("status", 20).notNullable().defaultTo("PENDING");

    table.integer("attempts").notNullable().defaultTo(0);

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.timestamp("published_at").nullable();

    table.text("last_error").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("outbox_events");
}