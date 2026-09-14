import { kafka } from "./kafka";

import {
  kafkaMessagesProducedTotal,
  kafkaMessagesFailedTotal,
} from "../metrics";

import { KafkaRetryService } from "./kafkaRetry";

import { logger } from "../logger/logger.service";

export const producer = kafka.producer({
  idempotent: true,
}
);

const kafkaRetryService = 
  new KafkaRetryService();

// ======================================================
// Connect Kafka Producer
// ======================================================

export async function connectProducer() {

  await producer.connect();

  logger.info(
    "Booking Kafka Producer Connected"
  );
}

// ======================================================
// Send Kafka Message
// ======================================================

export async function sendKafkaMessage(
  topic: string,

  messages: {
    key?: string;
    value: string;
  }[]
) {

  try {

    const result =
      await kafkaRetryService.execute(

        async () => {

          return await producer.send({
            topic,
            messages,
          });

        }

      );

    // Message was successfully produced

    kafkaMessagesProducedTotal.inc({
      topic,
      service: "booking-service",
    });

    logger.info(
      `Kafka message successfully produced to topic ${topic}`
    );

    return result;

  } catch (error: any) {

    // All retries failed

    kafkaMessagesFailedTotal.inc({
      topic,
      service: "booking-service",
    });

    logger.error(
      `Failed to produce Kafka message to topic ${topic}: ${error.message}`
    );

    throw error;
  }
}