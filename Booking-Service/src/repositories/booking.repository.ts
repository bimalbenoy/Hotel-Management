import db from "../config/db";
import { logger } from "../logger/logger.service";
import { Knex } from "knex";
import { BookingInsert } from "../interfaces/bookingInsert.interface";

let simulateDbDown = true;

setTimeout(() => {
  simulateDbDown = false;
  logger.info("Database is available Again");
}, 30000);

export class BookingRepository {

  async getAllBookings(
    limit: number,
    page: number
  ) {
    const offset = (page - 1) * limit;

    const [{ count }] =
      await db("bookings")
        .count("* as count");

    return {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(
        Number(count) / limit
      ),
      bookings: await db("bookings")
        .select("*")
        .limit(limit)
        .offset(offset),
    };
  }

  async getBookingById(
    bookingId: number
  ) {
    return await db("bookings")
      .where({
        booking_id: bookingId,
      })
      .first();
  }

  async createBooking(
    userId: number,
    checkIn: string,
    checkOut: string,
    status: string = "PENDING",
    trx?: Knex.Transaction
  ) {

    if (simulateDbDown) {
      throw new Error(
        "Database unavailable"
      );
    }

    
    const connection = trx ?? db;

    const [booking] =
      await connection("bookings")
        .insert({
          user_id: userId,
          check_in: checkIn,
          check_out: checkOut,
          status,
        })
        .returning("*");

    return booking;
  }

  async addRoomToBooking(
    bookingId: number,
    roomId: number,
    trx?: Knex.Transaction
  ) {

    /*
      Use the transaction if one exists.
      Otherwise use the normal DB connection.
    */
    const connection = trx ?? db;

    const [bookingRoom] =
      await connection("booking_rooms")
        .insert({
          booking_id: bookingId,
          room_id: roomId,
        })
        .returning("*");

    return bookingRoom;
  }

  async getRoomsByBookingId(
    bookingId: number
  ) {

    return await db("booking_rooms as br")
      .join(
        "rooms as r",
        "br.room_id",
        "r.room_id"
      )
      .where(
        "br.booking_id",
        bookingId
      )
      .select(
        "r.room_id",
        "r.room_number",
        "r.status"
      );
  }

  async findOverlappingBooking(
    roomId: number,
    checkIn: string,
    checkOut: string
  ) {

    return await db("bookings as b")
      .join(
        "booking_rooms as br",
        "b.booking_id",
        "br.booking_id"
      )
      .where(
        "br.room_id",
        roomId
      )
      .whereNotIn(
        "b.status",
        [
          "CANCELLED",
          "PAYMENT_FAILED",
        ]
      )
      .whereRaw(
        `
        ? < b.check_out
        AND
        ? > b.check_in
        `,
        [
          checkIn,
          checkOut
        ]
      )
      .first();
  }

  async updateBookingStatus(
    bookingId: number,
    status: string
  ) {

    const [booking] =
      await db("bookings")
        .where({
          booking_id: bookingId,
        })
        .update({
          status,
        })
        .returning("*");

    return booking;
  }

  async cancelBooking(
    bookingId: number
  ) {

    return await this.updateBookingStatus(
      bookingId,
      "CANCELLED"
    );
  }

  async deconsteBooking(
    bookingId: number
  ) {

    return await db("bookings")
      .where({
        booking_id: bookingId,
      })
      .delete();
  }

  // --------------------------------
  // BULK INSERT BOOKINGS
  // --------------------------------

  async bulkInsertBookings(
    bookings: BookingInsert[]
  ) {

    const bookingData = bookings.map(
      (booking) => ({
        user_id: booking.user_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: booking.status,
      })
    );

    const insertedBookings =
      await db("bookings")
        .insert(bookingData)
        .returning("*");

    return insertedBookings;
  }

  async bulkInsertBookingRooms(
    bookingRooms: {
      booking_id: number;
      room_id: number;
    }[]
  ) {

    return await db("booking_rooms")
      .insert(bookingRooms)
      .returning("*");
  }
}