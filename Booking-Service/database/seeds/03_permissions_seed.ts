import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("permissions").del();

  await knex("permissions").insert([
    {
      permission_name: "VIEW_USERS",
      description: "View all users"
    },
    {
      permission_name: "CREATE_USERS",
      description: "Create new users"
    },
    {
      permission_name: "DISABLE_USERS",
      description: "Disable users"
    },
    {
      permission_name: "VIEW_ROOMS",
      description: "View rooms"
    },
    {
      permission_name: "CREATE_ROOMS",
      description: "Create rooms"
    },
    {
      permission_name: "UPDATE_ROOMS",
      description: "Update rooms"
    },
    {
      permission_name: "DELETE_ROOMS",
      description: "Delete rooms"
    },
    {
      permission_name: "CREATE_BOOKINGS",
      description: "Create bookings"
    },
    {
      permission_name: "VIEW_BOOKINGS",
      description: "View bookings"
    },
    {
      permission_name: "VIEW_PAYMENTS",
      description: "View payments"
    }
  ]);
}