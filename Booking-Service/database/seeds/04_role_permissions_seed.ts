import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

  await knex("role_permissions").del();

  await knex("role_permissions").insert([

    // ===========================
    // SUPER_ADMIN (role_id = 3)
    // All permissions
    // ===========================

    { role_id: 3, permission_id: 1 },
    { role_id: 3, permission_id: 2 },
    { role_id: 3, permission_id: 3 },
    { role_id: 3, permission_id: 4 },
    { role_id: 3, permission_id: 5 },
    { role_id: 3, permission_id: 6 },
    { role_id: 3, permission_id: 7 },
    { role_id: 3, permission_id: 8 },
    { role_id: 3, permission_id: 9 },
    { role_id: 3, permission_id: 10 },

    // ===========================
    // ADMIN (role_id = 1)
    // Limited permissions
    // ===========================

    { role_id: 1, permission_id: 1 }, // VIEW_USERS
    { role_id: 1, permission_id: 4 }, // VIEW_ROOMS
    { role_id: 1, permission_id: 5 }, // CREATE_ROOMS
    { role_id: 1, permission_id: 6 }, // UPDATE_ROOMS
    { role_id: 1, permission_id: 8 }, // CREATE_BOOKINGS
    { role_id: 1, permission_id: 9 }, // VIEW_BOOKINGS
    { role_id: 1, permission_id: 10 }, // VIEW_PAYMENTS

    // CUSTOMER (role_id = 2)
    // No management permissions for now

  ]);

}