import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("wallets", (table) => {
    table.increments("wallet_id").primary();

    table.integer("user_id").notNullable().unique();

    table.decimal("balance", 10, 2)
      .notNullable()
      .defaultTo(0);

    table.timestamp("created_at")
      .defaultTo(knex.fn.now());

    table.timestamp("updated_at")
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("wallets");
}