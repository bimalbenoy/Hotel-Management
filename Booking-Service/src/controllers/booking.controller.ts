import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import fs from "fs";
import csv from "csv-parser";
import {BookingCSVRow} from "../interfaces/bookingCSV.interface"



export class BookingController {

  private bookingService =
    new BookingService();

  async getAll(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

      const bookings =

        await this.bookingService
          .getAllBookings(limit,page);

      return res.status(200).json({
        success: true,
        data: bookings,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  async getById(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const bookingId =
        Number(req.params.id);

      const booking =
        await this.bookingService
          .getBookingById(
            bookingId
          );

      return res.status(200).json({
        success: true,
        data: booking,
      });

    } catch (error: any) {

      return res.status(404).json({
        success: false,
        message: error.message,
      });

    }
  }

  async create(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const {
        roomId,
        checkIn,
        checkOut,
      } = req.body;

      const user =
        (req as any).user;

      const booking =
        await this.bookingService
          .createBookingWithRetry(
            user.userID,
            roomId,
            checkIn,
            checkOut
          );

      return res.status(201).json({
        success: true,
        message:
          "Booking created successfully",
        data: booking,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  async cancel(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const bookingId =
        Number(req.params.id);

      const booking =
        await this.bookingService
          .cancelBooking(
            bookingId
          );

      return res.status(200).json({
        success: true,
        message:
          "Booking cancelled successfully",
        data: booking,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }
  //bulk uploading
 async uploadBookings(
  req: Request,
  res: Response
) {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "File not Uploaded"
      });

    }
    const fileName = req.file.originalname.toLowerCase();

    if (!fileName.endsWith(".csv")) {

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Only CSV files are allowed."
      });

    }

    const filePath = req.file.path;

    const BATCH_SIZE = 2;

    const batch: BookingCSVRow[] = [];

    let totalRows = 0;
    let successCount = 0;
    let failedCount = 0;

    const successful: any[] = [];
    const failed: any[] = [];

    const stream =
      fs.createReadStream(filePath)
        .pipe(csv());

    stream.on("data", async (row: BookingCSVRow) => {

      batch.push(row);

      totalRows++;

      if (batch.length >= BATCH_SIZE) {
        console.log("Processing batch of size:", batch.length);

        stream.pause();

        try {

          const result =
            await this.bookingService
              .uploadBookings([...batch]);

          successCount += result.successCount;
          failedCount += result.failedCount;

          successful.push(...result.successful);
          failed.push(...result.failed);

          batch.length = 0;

          stream.resume();

        } catch (err) {

          stream.destroy(err as Error);

        }

      }

    });

    stream.on("end", async () => {

      try {

        if (batch.length > 0) {

          const result =
            await this.bookingService
              .uploadBookings(batch);

          successCount += result.successCount;
          failedCount += result.failedCount;

          successful.push(...result.successful);
          failed.push(...result.failed);

        }

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(200).json({

          success: true,

          message:
            "CSV processed successfully",

          totalRows,

          successCount,

          failedCount,

          successful,

          failed

        });

      } catch (err: any) {

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        return res.status(500).json({

          success: false,

          message:
            "Database processing failed.",

          error: err.message

        });

      }

    });

    stream.on("error", (err) => {

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(500).json({

        success: false,

        message: err.message

      });

    });

  } catch (error: any) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

}
}