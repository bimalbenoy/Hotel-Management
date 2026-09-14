export class LoggerService {
  private format(level: string, message: string) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  info(message: string) {
    console.log(this.format("INFO", message));
  }

  error(message: string) {
    console.error(this.format("ERROR", message));
  }
}

export const logger = new LoggerService();
