import { kafka } from "./kafka";

import {
  kafkaMessagesProducedTotal,
  kafkaMessagesFailedTotal,
} from "../metrics";

import { KafkaRetryService } from "./kafkaRetry";

import { logger } from "../logger/logger.service";

export const producer =
  kafka.producer();

const kafkaRetryService =
  new KafkaRetryService();

export async function connectProducer() {

  await producer.connect();

  logger.info(
    "Payment Kafka Producer Connected"
  );
}

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

    kafkaMessagesProducedTotal.inc({
      topic,
      service: "payment-service",
    });

    logger.info(
      `Kafka message successfully produced to topic ${topic}`
    );

    return result;

  } catch (error: any) {

    kafkaMessagesFailedTotal.inc({
      topic,
      service: "payment-service",
    });

    logger.error(
      `Failed to produce Kafka message to topic ${topic}: ${error.message}`
    );

    throw error;
  }
}