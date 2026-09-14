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
          `Kafka attempt ${attempt}/${maxRetries}`
        );

        return await operation();

      } catch (error: any) {

        logger.error(
          `Kafka operation failed on attempt ${attempt}/${maxRetries}: ${error.message}`
        );

        if (attempt === maxRetries) {

          logger.error(
            "Kafka operation failed after all retries"
          );

          throw error;
        }

        await this.delay(
          retryDelay
        );
      }
    }

    throw new Error(
      "Unexpected Kafka retry failure"
    );
  }

  private async delay(
    ms: number
  ): Promise<void> {

    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }
}