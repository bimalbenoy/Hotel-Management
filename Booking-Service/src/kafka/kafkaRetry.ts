import { logger } from "../logger/logger.service";

export class KafkaRetryService {

  async execute<T>(
    operation: () => Promise<T>,
    maxRetries: number = 5,
    retryDelay: number = 5000
  ): Promise<T> {

    for (
      let attempt = 1;
      attempt <= maxRetries;
      attempt++
    ) {

      try {

        logger.info(
          `Kafka operation attempt ${attempt}/${maxRetries}`
        );

        return await operation();

      } catch (error: any) {

        logger.error(
          `Kafka operation failed on attempt ${attempt}: ${error.message}`
        );

        if (attempt === maxRetries) {

          logger.error(
            "Kafka operation failed after all retry attempts"
          );

          throw error;
        }

        logger.info(
          `Retrying Kafka operation in ${retryDelay}ms`
        );

        await this.delay(retryDelay);
      }
    }

    throw new Error(
      "Kafka retry operation failed unexpectedly"
    );
  }

  private delay(
    milliseconds: number
  ): Promise<void> {

    return new Promise(
      resolve =>
        setTimeout(
          resolve,
          milliseconds
        )
    );
  }
}