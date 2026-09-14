import { BookingService } from "../../services/booking.service";
import { BookingRepository } from "../../repositories/booking.repository";
import { RoomRepository } from "../../repositories/room.repository";

describe("BookingService", () => {

  let bookingService: BookingService;

  beforeEach(() => {
    bookingService = new BookingService();

    jest.clearAllMocks();
  });

  describe("getAllBookings()", () => {

    it("should return all bookings", async () => {

      const bookings = [
        {
          booking_id: 1,
          user_id: 1,
          status: "CONFIRMED",
        },
        {
          booking_id: 2,
          user_id: 2,
          status: "CONFIRMED",
        },
      ];

      jest
        .spyOn(
          BookingRepository.prototype,
          "getAllBookings"
        )
        .mockResolvedValue(bookings as any);

      const result =
        await bookingService.getAllBookings();

      expect(result).toEqual(bookings);

      expect(
        BookingRepository.prototype.getAllBookings
      ).toHaveBeenCalledTimes(1);

    });

  });

  describe("getBookingById()", () => {

    it("should return booking when booking exists", async () => {

      const booking = {
        booking_id: 1,
        user_id: 1,
        status: "CONFIRMED",
      };

      jest
        .spyOn(
          BookingRepository.prototype,
          "getBookingById"
        )
        .mockResolvedValue(booking as any);

      const result =
        await bookingService.getBookingById(1);

      expect(result).toEqual(booking);

      expect(
        BookingRepository.prototype.getBookingById
      ).toHaveBeenCalledWith(1);

    });

    it("should throw error when booking does not exist", async () => {

      jest
        .spyOn(
          BookingRepository.prototype,
          "getBookingById"
        )
        .mockResolvedValue(undefined);

      await expect(

        bookingService.getBookingById(1)

      ).rejects.toThrow(
        "Booking not found"
      );

    });

  });

  describe("createBooking()", () => {

    it("should create booking successfully", async () => {

      const room = {
        room_id: 1,
      };

      const booking = {
        booking_id: 10,
      };

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue(room as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "findOverlappingBooking"
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(
          BookingRepository.prototype,
          "createBooking"
        )
        .mockResolvedValue(booking as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "addRoomToBooking"
        )
        .mockResolvedValue({} as any);

      const result =
        await bookingService.createBooking(
          1,
          1,
          "2026-07-01",
          "2026-07-05"
        );

      expect(result).toEqual(booking);

      expect(
        BookingRepository.prototype.addRoomToBooking
      ).toHaveBeenCalledWith(
        10,
        1
      );

    });

    it("should throw error when room does not exist", async () => {

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue(undefined);

      await expect(

        bookingService.createBooking(
          1,
          1,
          "2026-07-01",
          "2026-07-05"
        )

      ).rejects.toThrow(
        "Room not found"
      );

    });

    it("should throw error when checkout is before checkin", async () => {

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue({
          room_id: 1,
        } as any);

      await expect(

        bookingService.createBooking(
          1,
          1,
          "2026-07-10",
          "2026-07-05"
        )

      ).rejects.toThrow(
        "Check out must be after check in"
      );

    });

    it("should throw error when checkin and checkout are same day", async () => {

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue({
          room_id: 1,
        } as any);

      await expect(

        bookingService.createBooking(
          1,
          1,
          "2026-07-10",
          "2026-07-10"
        )

      ).rejects.toThrow(
        "Check out must be after check in"
      );

    });
        it("should throw error when room is already booked (overlap)", async () => {

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue({
          room_id: 1,
        } as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "findOverlappingBooking"
        )
        .mockResolvedValue({
          booking_id: 5,
        } as any);

      await expect(

        bookingService.createBooking(
          1,
          1,
          "2026-07-02",
          "2026-07-04"
        )

      ).rejects.toThrow(
        "Room already booked for selected dates"
      );

    });

    it("should allow booking when there is no overlap", async () => {

      const booking = {
        booking_id: 20,
      };

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue({
          room_id: 1,
        } as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "findOverlappingBooking"
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(
          BookingRepository.prototype,
          "createBooking"
        )
        .mockResolvedValue(booking as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "addRoomToBooking"
        )
        .mockResolvedValue({} as any);

      const result =
        await bookingService.createBooking(
          1,
          1,
          "2026-08-01",
          "2026-08-05"
        );

      expect(result).toEqual(booking);

    });

    it("should call findOverlappingBooking with correct arguments", async () => {

      jest
        .spyOn(
          RoomRepository.prototype,
          "getRoomById"
        )
        .mockResolvedValue({
          room_id: 1,
        } as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "findOverlappingBooking"
        )
        .mockResolvedValue(undefined);

      jest
        .spyOn(
          BookingRepository.prototype,
          "createBooking"
        )
        .mockResolvedValue({
          booking_id: 1,
        } as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "addRoomToBooking"
        )
        .mockResolvedValue({} as any);

      await bookingService.createBooking(
        1,
        1,
        "2026-07-01",
        "2026-07-05"
      );

      expect(
        BookingRepository.prototype.findOverlappingBooking
      ).toHaveBeenCalledWith(
        1,
        "2026-07-01",
        "2026-07-05"
      );

    });

  });

  describe("cancelBooking()", () => {

    it("should cancel booking successfully", async () => {

      const booking = {
        booking_id: 1,
      };

      const cancelledBooking = {
        booking_id: 1,
        status: "CANCELLED",
      };

      jest
        .spyOn(
          BookingRepository.prototype,
          "getBookingById"
        )
        .mockResolvedValue(booking as any);

      jest
        .spyOn(
          BookingRepository.prototype,
          "cancelBooking"
        )
        .mockResolvedValue(cancelledBooking as any);

      const result =
        await bookingService.cancelBooking(1);

      expect(result).toEqual(
        cancelledBooking
      );

      expect(
        BookingRepository.prototype.cancelBooking
      ).toHaveBeenCalledWith(1);

    });

    it("should throw error when booking to cancel does not exist", async () => {

      jest
        .spyOn(
          BookingRepository.prototype,
          "getBookingById"
        )
        .mockResolvedValue(undefined);

      await expect(

        bookingService.cancelBooking(1)

      ).rejects.toThrow(
        "Booking not found"
      );

    });

  });

});