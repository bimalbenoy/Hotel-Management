import { kafka } from "./kafka";

import { TOPICS } from "./topics";

import { BookingRepository } from "../repositories/booking.repository";

import {
  kafkaMessagesConsumedTotal,
  kafkaMessagesFailedTotal,
} from "../metrics";

import { logger } from "../logger/logger.service";


const consumer = kafka.consumer({
  groupId: "booking-group",
});

const bookingRepository =
  new BookingRepository();

export async function startConsumer() {

  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.PAYMENT_RESULT,
    fromBeginning: false,
  });

  logger.info(
    "Booking Kafka Consumer Connected"
  );

  // ======================================================
  // Start Kafka Consumer
  // ======================================================

  await consumer.run({

    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {

      // ==================================================
      // Check Empty Message
      // ==================================================

      if (!message.value) {

        logger.info(
          "Empty Kafka message received"
        );

        return;
      }

      let event: any;

      try {
       

        // ==================================================
        // Parse Kafka Message
        // ==================================================

        event = JSON.parse(
          message.value.toString()
        );

        logger.info(
          `Payment result received | ` +
          `topic=${topic} | ` +
          `partition=${partition} | ` +
          `bookingId=${event.bookingId} | ` +
          `status=${event.status}`
        );
        //  console.log("TEST: Kafka message received");

        // throw new Error("TEST KAFKA FAILURE"); 

        // ==================================================
        // Process Payment Result
        // ==================================================

        switch (event.status) {

          // ----------------------------------------------
          // PAYMENT SUCCESS
          // ----------------------------------------------

          case "SUCCESS":

            await bookingRepository
              .updateBookingStatus(
                event.bookingId,
                "CONFIRMED"
              );

            logger.info(
              `Booking ${event.bookingId} confirmed successfully`
            );

            break;

          // ----------------------------------------------
          // PAYMENT FAILED
          // ----------------------------------------------

          case "FAILED":

            await bookingRepository
              .updateBookingStatus(
                event.bookingId,
                "PAYMENT_FAILED"
              );

            logger.info(
              `Booking ${event.bookingId} marked as PAYMENT_FAILED`
            );

            break;

          // ----------------------------------------------
          // UNKNOWN STATUS
          // ----------------------------------------------

          default:

            logger.error(
              `Unknown payment status received: ${event.status}`
            );

            throw new Error(
              `Invalid payment status: ${event.status}`
            );
        }

        // ==================================================
        // MESSAGE SUCCESSFULLY CONSUMED
        // ==================================================
        //
        // This counter increases ONLY after the message
        // was successfully processed.
        // ==================================================

        kafkaMessagesConsumedTotal.inc({
          topic,
          service: "booking-service",
        });

        logger.info(
          `Kafka message consumed successfully | ` +
          `topic=${topic} | ` +
          `bookingId=${event.bookingId}`
        );

      } catch (error: any) {

        // ==================================================
        // MESSAGE PROCESSING FAILED
        // ==================================================

        kafkaMessagesFailedTotal.inc({
          topic,
          service: "booking-service",
        });

        logger.error(
          `Error processing payment result: ` +
          `${error.message}`
        );

        // Throw error so Kafka knows processing failed

        throw error;
      }
    },
  });
}