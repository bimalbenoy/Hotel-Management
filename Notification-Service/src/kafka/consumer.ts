import { kafka } from "./kafka";
import { TOPICS } from "./topics";
import { NotificationService } from "../services/Notification.service";
import { logger } from "../logger/logger.service";

import {
  kafkaMessagesConsumedTotal,
  kafkaMessagesFailedTotal,
} from "../metrics";


const SERVICE_NAME = "notification-service";

const consumer = kafka.consumer({
  groupId: "notification-group",
});

const notificationService =
  new NotificationService();


export async function startConsumer() {

  

  await consumer.connect();

  logger.info(
    "Notification Kafka Consumer Connected"
  );


  

  await consumer.subscribe({
    topic: TOPICS.PAYMENT_RESULT,
    fromBeginning: true,
  });

  logger.info(
    `Notification Service subscribed to topic=${TOPICS.PAYMENT_RESULT}`
  );


  

  await consumer.run({

    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {

     

      if (!message.value) {

        logger.warn(
          `Received empty Kafka message from topic=${topic}, ` +
          `partition=${partition}`
        );

        return;
      }


      let event: any;


      try {

        

        event = JSON.parse(
          message.value.toString()
        );
        // console.log(" TEST: Kafka message received");

        // throw new Error("TEST KAFKA FAILURE"); 


        logger.info(
          `Received payment result | ` +
          `bookingId=${event.bookingId} | ` +
          `status=${event.status} | ` +
          `topic=${topic} | ` +
          `partition=${partition}`
        );


        

        if (event.status === "SUCCESS") {

          await notificationService
            .sendPaymentSuccess(
              event.email,
              event.bookingId
            );
            

          logger.info(
            `Payment success notification sent ` +
            `for bookingId=${event.bookingId}`
          );
          // throw new Error("TEST KAFKA FAILURE");
        }



        else if (event.status === "FAILED") {

          await notificationService
            .sendPaymentFailed(
              event.email,
              event.bookingId,
              event.reason ||
                "Payment processing failed"
            );

          logger.info(
            `Payment failure notification sent ` +
            `for bookingId=${event.bookingId}`
          );
        }




        else {

          throw new Error(
            `Unknown payment status: ${event.status}`
          );
          
        }



        kafkaMessagesConsumedTotal.inc({
          topic,
          service: SERVICE_NAME,
        });


        logger.info(
          `Kafka message successfully consumed | ` +
          `topic=${topic} | ` +
          `bookingId=${event.bookingId}`
        );


      } catch (error: any) {

      

        logger.error(
          `Notification processing failed | ` +
          `topic=${topic} | ` +
          `partition=${partition} | ` +
          `bookingId=${event?.bookingId} | ` +
          `error=${error?.message || error}`
        );



        kafkaMessagesFailedTotal.inc({
          topic,
          service: SERVICE_NAME,
        });

        throw error;
      }
    },
  });
}