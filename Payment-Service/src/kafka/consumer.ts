import { kafka } from "./kafka";
import { TOPICS } from "./topics";
import { PaymentService } from "../services/Payment.services";
import { sendKafkaMessage } from "./producer";
import { logger } from "../logger/logger.service";

import {
  kafkaMessagesConsumedTotal,
  kafkaMessagesFailedTotal,
} from "../metrics";

const consumer = kafka.consumer({
  groupId: "payment-group",
});

const paymentService = new PaymentService();

export async function startConsumer() {

  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.BOOKINGS_CREATED,
    fromBeginning: true,
  });

  logger.info(
    "Payment Kafka Consumer Connected"
  );

  await consumer.run({

    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {

      if (!message.value) {

        logger.info(
          `Received empty Kafka message from topic=${topic}`
        );

        return;
      }

      let event: any;
      //try catch block of json parse start
      try {

        event = JSON.parse(
          message.value.toString()
        );

      } catch (error: any) {

        logger.error(
          `Invalid Kafka message: ${error?.message || error}`
        );

        kafkaMessagesFailedTotal.inc({
          topic,
          service: "payment-service",
        });

        return;//skips the offeset
      }
      //try catch block of json parse end
      //log the parse data
      logger.info(
        `Received booking event | ` +
        `bookingId=${event.bookingId} | ` +
        `topic=${topic} | ` +
        `partition=${partition}`
      );

      let payment;
      //try catch of create payment starts
      try {

        payment =
          await paymentService.createPayment(
            event.bookingId,
            event.userId,
            event.amount,
            event.paymentMethod
          );
       
      } catch (error: any) {//catch the createPayment fuction errors

        const errorMessage =
          error?.message ||
          "Payment processing failed";

        logger.info(
          `Payment failed for bookingId=${event.bookingId}: ` +
          `${errorMessage}`
        );

        try {//eroor is catched trying to send failiur msg

          await sendKafkaMessage(
            TOPICS.PAYMENT_RESULT,
            [
              {
                key: String(
                  event.bookingId
                ),

                value: JSON.stringify({
                  bookingId:
                    event.bookingId,

                  userId:
                    event.userId,

                  email:
                    event.email,

                  status:
                    "FAILED",

                  reason:
                    errorMessage,
                }),
              },
            ]
          );

          logger.info(
            `Payment FAILED event sent for bookingId=${event.bookingId}`
          );

        } catch (kafkaError: any) {//chathes the kafka failure send if that fail(kafka fail)

          logger.error(
            `Failed to send FAILED PAYMENT_RESULT ` +
            `for bookingId=${event.bookingId}: ` +
            `${kafkaError?.message || kafkaError}`
          );

          kafkaMessagesFailedTotal.inc({
            topic: TOPICS.PAYMENT_RESULT,
            service: "payment-service",
          });

          throw kafkaError;//offset ist updated till the failure msg is send 
        }

        return;
      }

      try {

        await sendKafkaMessage(//no exception in createpayment send success kafka msg
          TOPICS.PAYMENT_RESULT,
          [
            {
              key: String(
                event.bookingId
              ),

              value: JSON.stringify({
                bookingId:
                  event.bookingId,

                userId:
                  event.userId,

                email:
                  event.email,

                paymentId:
                  payment.payment_id,

                status:
                  "SUCCESS",
              }),
            },
          ]
        );

      } catch (kafkaError: any) {//kafka send success failed and redoing it

        logger.error(
          `Failed to send SUCCESS PAYMENT_RESULT ` +
          `for bookingId=${event.bookingId}: ` +
          `${kafkaError?.message || kafkaError}`
        );

        kafkaMessagesFailedTotal.inc({
          topic: TOPICS.PAYMENT_RESULT,
          service: "payment-service",
        });

        throw kafkaError;
      }

      kafkaMessagesConsumedTotal.inc({
        topic,
        service: "payment-service",
      });

      logger.info(
        `Payment SUCCESS for bookingId=${event.bookingId}`
      );

    },

  });
}