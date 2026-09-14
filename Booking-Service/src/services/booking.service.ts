import { BookingRepository } from "../repositories/booking.repository";
import { RoomRepository } from "../repositories/room.repository";
import { BookingCSVRow } from "../interfaces/bookingCSV.interface";
import { UserRepository } from "../repositories/user.repository";
import { logger } from "../logger/logger.service";
import { RetryService } from "./retry.service";
import { TOPICS } from "../kafka/topics";
import { RoomTypeServices } from "../services/roomTypes.services";
import db from "../config/db";
import { OutboxRepository } from "../repositories/outbox.repository";


export class BookingService {

  private retryService =
    new RetryService();

  private bookingRepository =
    new BookingRepository();

  private roomRepository =
    new RoomRepository();

  private userRepository =
    new UserRepository();

  private roomTypeService =
    new RoomTypeServices();

  private outboxRepository =
    new OutboxRepository();


  // ============================================
  // GET ALL BOOKINGS
  // ============================================

  async getAllBookings(
    limit: number = 10,
    page: number = 1
  ) {

    logger.info(
      "BookingService.getAllBookings called"
    );

    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }

    if (limit > 100) {
      limit = 100;
    }

    const bookings =
      await this.bookingRepository
        .getAllBookings(
          limit,
          page
        );

    logger.info(
      `BookingService.getAllBookings returned ${bookings.total} bookings`
    );

    return bookings;
  }


  // ============================================
  // VALIDATE BULK OVERLAP
  // ============================================

  private validateBulkOverlap(
    bookingInserts: any[],
    roomId: number,
    checkIn: string,
    checkOut: string
  ) {

    const newCheckIn =
      new Date(checkIn);

    const newCheckOut =
      new Date(checkOut);

    for (
      const booking of bookingInserts
    ) {

      const existingCheckIn =
        new Date(
          booking.check_in
        );

      const existingCheckOut =
        new Date(
          booking.check_out
        );

      if (
        booking.room_id === roomId &&
        newCheckIn < existingCheckOut &&
        newCheckOut > existingCheckIn
      ) {

        throw new Error(
          "Room already booked in uploaded CSV"
        );
      }
    }
  }


  // ============================================
  // GET BOOKING BY ID
  // ============================================

  async getBookingById(
    bookingId: number
  ) {

    logger.info(
      `BookingService.getBookingById called for bookingId=${bookingId}`
    );

    const booking =
      await this.bookingRepository
        .getBookingById(
          bookingId
        );

    if (!booking) {

      logger.error(
        `BookingService.getBookingById failed: bookingId=${bookingId} not found`
      );

      throw new Error(
        "Booking not found"
      );
    }

    logger.info(
      `BookingService.getBookingById succeeded for bookingId=${bookingId}`
    );

    return booking;
  }


  // ============================================
  // VALIDATE BOOKING
  // ============================================

  private async validateBooking(
    roomId: number,
    checkIn: string,
    checkOut: string
  ): Promise<void> {

    // Check whether room exists

    const room =
      await this.roomRepository
        .getRoomById(
          roomId
        );

    if (!room) {

      throw new Error(
        "Room not found"
      );
    }


    // Validate dates

    const checkInDate =
      new Date(checkIn);

    const checkOutDate =
      new Date(checkOut);

    if (
      checkOutDate <= checkInDate
    ) {

      throw new Error(
        "Check out must be after check in"
      );
    }


    // Check overlapping bookings

    const overlap =
      await this.bookingRepository
        .findOverlappingBooking(
          roomId,
          checkIn,
          checkOut
        );

    if (overlap) {

      throw new Error(
        "Room already booked for selected dates"
      );
    }
  }


  // ============================================
  // CREATE BOOKING
  // ============================================

  async createBooking(
    userId: number,
    roomId: number,
    checkIn: string,
    checkOut: string
  ) {

    // --------------------------------------------
    // STEP 1: Validate booking
    // --------------------------------------------

    await this.validateBooking(
      roomId,
      checkIn,
      checkOut
    );


    // --------------------------------------------
    // STEP 2: Get room
    // --------------------------------------------

    const room =
      await this.roomRepository
        .getRoomById(
          roomId
        );

    if (!room) {

      throw new Error(
        "Room not found"
      );
    }


    // --------------------------------------------
    // STEP 3: Get room type
    // --------------------------------------------

    const roomType =
      await this.roomTypeService
        .getRoomTypeById(
          room.room_types_id
        );


    // --------------------------------------------
    // STEP 4: Calculate total amount
    // --------------------------------------------

    const days =
      (
        new Date(checkOut).getTime() -
        new Date(checkIn).getTime()
      ) /
      (1000 * 60 * 60 * 24);

    const total_amount =
      days *
      roomType.price_per_night;


    // --------------------------------------------
    // STEP 5: Get user
    // --------------------------------------------

    const user =
      await this.userRepository
        .findById(
          userId
        );

    if (!user) {

      throw new Error(
        "User not found"
      );
    }


    // --------------------------------------------
    // STEP 6: START DATABASE TRANSACTION
    // --------------------------------------------

    const booking =
      await db.transaction(
        async (trx) => {


          // --------------------------------------
          // STEP 7: Create booking
          // --------------------------------------

          const booking =
            await this.bookingRepository
              .createBooking(
                userId,
                checkIn,
                checkOut,
                "PENDING",
                trx
              );


          // --------------------------------------
          // STEP 8: Add room to booking
          // --------------------------------------

          await this.bookingRepository
            .addRoomToBooking(
              booking.booking_id,
              roomId,
              trx
            );


          // --------------------------------------
          // STEP 9: Create OUTBOX EVENT
          // --------------------------------------

          const payload =
            JSON.stringify({

              bookingId:
                booking.booking_id,

              userId:
                booking.user_id,

              email:
                user.email,

              amount:
                total_amount,

              paymentMethod:
                "WALLET",

            });


          await this.outboxRepository
            .createEvent(

              TOPICS.BOOKINGS_CREATED,

              String(
                booking.booking_id
              ),

              payload,

              trx
            );


          // --------------------------------------
          // STEP 10: Return booking
          // --------------------------------------

          return booking;
        }
      );


    // --------------------------------------------
    // STEP 11: Transaction completed
    // --------------------------------------------

    logger.info(
      `Booking ${booking.booking_id} created successfully with outbox event`
    );

    return booking;
  }


  // ============================================
  // CANCEL BOOKING
  // ============================================

  async cancelBooking(
    bookingId: number
  ) {

    logger.info(
      `BookingService.cancelBooking called for bookingId=${bookingId}`
    );

    const booking =
      await this.bookingRepository
        .getBookingById(
          bookingId
        );

    if (!booking) {

      logger.error(
        `BookingService.cancelBooking failed: bookingId=${bookingId} not found`
      );

      throw new Error(
        "Booking not found"
      );
    }

    const canceled =
      await this.bookingRepository
        .cancelBooking(
          bookingId
        );

    logger.info(
      `BookingService.cancelBooking succeeded for bookingId=${bookingId}`
    );

    return canceled;
  }


  // ============================================
  // BULK CREATE BOOKINGS
  // ============================================

  async uploadBookings(
    rows: BookingCSVRow[]
  ) {

    logger.info(
      `BookingService.uploadBookings called for ${rows.length} rows`
    );

    const failed: any[] = [];

    const bookingInserts: any[] = [];


    // --------------------------------------------
    // Validate every row
    // --------------------------------------------

    for (
      const row of rows
    ) {

      logger.info(
        `Processing row: email=${row.email}, room=${row.room_number}`
      );

      try {

        const user =
          await this.userRepository
            .findByEmail(
              row.email
            );

        if (!user) {

          throw new Error(
            "User not found"
          );
        }


        const room =
          await this.roomRepository
            .findByRoomNumber(
              row.room_number
            );

        if (!room) {

          throw new Error(
            "Room not found"
          );
        }


        await this.validateBooking(
          room.room_id,
          row.check_in,
          row.check_out
        );


        this.validateBulkOverlap(
          bookingInserts,
          room.room_id,
          row.check_in,
          row.check_out
        );


        bookingInserts.push({

          user_id:
            user.user_id,

          room_id:
            room.room_id,

          check_in:
            row.check_in,

          check_out:
            row.check_out,

          status:
            "CONFIRMED",

        });

      }
      catch (error: any) {

        logger.error(
          `Booking upload failed for ${row.email}: ${error.message}`
        );

        failed.push({

          email:
            row.email,

          roomNumber:
            row.room_number,

          reason:
            error.message,

        });
      }
    }


    logger.info(
      `${bookingInserts.length} bookings validated successfully`
    );


    if (
      bookingInserts.length === 0
    ) {

      return {

        totalRows:
          rows.length,

        successCount:
          0,

        failedCount:
          failed.length,

        successful:
          [],

        failed,

      };
    }


    // --------------------------------------------
    // Bulk insert BOOKINGS
    // --------------------------------------------

    const insertedBookings =
      await this.bookingRepository
        .bulkInsertBookings(
          bookingInserts
        );


    logger.info(
      `${insertedBookings.length} bookings inserted successfully`
    );


    // --------------------------------------------
    // Prepare BOOKING_ROOMS
    // --------------------------------------------

    const bookingRoomInserts =
      insertedBookings.map(
        (booking, index) => ({

          booking_id:
            booking.booking_id,

          room_id:
            bookingInserts[index].room_id,

        })
      );


    logger.info(
      `${bookingRoomInserts.length} booking-room mappings prepared`
    );


    // --------------------------------------------
    // Bulk insert BOOKING_ROOMS
    // --------------------------------------------

    const insertedBookingRooms =
      await this.bookingRepository
        .bulkInsertBookingRooms(
          bookingRoomInserts
        );


    logger.info(
      `${insertedBookingRooms.length} booking-room mappings inserted`
    );


    return {

      totalRows:
        rows.length,

      successCount:
        insertedBookings.length,

      failedCount:
        failed.length,

      successful:
        insertedBookings,

      failed,

    };
  }


  // ============================================
  // CREATE BOOKING WITH RETRY
  // ============================================

  async createBookingWithRetry(
    userId: number,
    roomId: number,
    checkIn: string,
    checkOut: string
  ) {

    return await this.retryService.execute(
      () =>
        this.createBooking(
          userId,
          roomId,
          checkIn,
          checkOut
        )
    );
  }

}