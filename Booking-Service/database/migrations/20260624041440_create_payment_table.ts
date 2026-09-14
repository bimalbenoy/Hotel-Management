import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("payments",(table)=>{
        table.increments("payment_id").primary();
        table.integer("booking_id").notNullable();
        table.decimal("amount",10,2).notNullable();
        table.string("payment_method",50).notNullable();
        table.string("payment_status",20).notNullable().defaultTo("Pending");
        table.timestamp("payment_date").defaultTo(knex.fn.now());
        table.foreign("booking_id").references("booking_id").inTable("bookings");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("payments");
}

