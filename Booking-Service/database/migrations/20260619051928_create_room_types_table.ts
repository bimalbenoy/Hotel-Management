import type { Knex } from "knex";
import { table } from "node:console";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("Room_types",(table)=>{
        table.increments("room_types_id").primary();
        table.string("type_name",50).notNullable().unique();
        table.decimal("price_per_night",10,2).notNullable();
        table.text("description");
        table.timestamp("timestamp").defaultTo(knex.fn.now());
    }

    );
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("Room_types");
}

