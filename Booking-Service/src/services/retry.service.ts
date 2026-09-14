import { logger } from "../logger/logger.service";

export class RetryService {

  async execute<T>(
    operation: () => Promise<T>,
    maxRetries: number = 5,
    retryDelay: number = 10000
  ): Promise<T> {

    for (
      let attempt = 1;
      attempt <= maxRetries;
      attempt++
    ) {

      try {

        logger.info(
          `Attempt ${attempt}`
        );

        return await operation();

      } catch (error: any) {

        if (error.message !== "Database unavailable") {
          throw error;
        }

        logger.error(
          `Database unavailable. Retry ${attempt}/${maxRetries}`
        );

        if (attempt === maxRetries) {
          throw new Error(
            `Operation failed after ${maxRetries} retries`
          );
        }

        await this.delay(retryDelay);

      }

    }

    throw new Error("Unexpected retry failure");
  }

  private async delay(
    ms: number
  ): Promise<void> {

    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );

  }

}