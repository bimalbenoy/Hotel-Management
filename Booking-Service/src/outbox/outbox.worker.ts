import { OutboxPublisher } from "./outbox.publisher";
import { logger } from "../logger/logger.service";

const publisher = new OutboxPublisher();

export function startOutboxWorker() {

  logger.info("Outbox worker started");

  setInterval(async () => {

    try {

      await publisher.publishPendingEvents();

    } catch (error: any) {

      logger.error(
        `Outbox worker error: ${error.message}`
      );

    }

  }, 5000);
}