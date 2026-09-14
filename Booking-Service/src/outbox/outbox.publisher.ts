import { OutboxRepository } from "../repositories/outbox.repository";
import { sendKafkaMessage } from "../kafka/producer";
import { logger } from "../logger/logger.service";

export class OutboxPublisher {

  private outboxRepository = new OutboxRepository();

  async publishPendingEvents() {

    const events =
      await this.outboxRepository.getPendingEvents(10);

    for (const event of events) {

      try {

        logger.info(
          `Publishing outbox event ${event.event_id}`
        );

        await sendKafkaMessage(
          event.event_type,
          [
            {
              key: event.aggregate_id,
              value: event.payload,
            },
          ]
        );

        await this.outboxRepository.markPublished(
          event.event_id
        );

        logger.info(
          `Outbox event ${event.event_id} published successfully`
        );

      } catch (error: any) {

        logger.error(
          `Failed to publish outbox event ${event.event_id}: ${error.message}`
        );

        await this.outboxRepository.markFailed(
          event.event_id,
          error.message
        );
      }
    }
  }
}