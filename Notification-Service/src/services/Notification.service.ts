import { transporter } from "../config/mail";
import { logger } from "../logger/logger.service";

export class NotificationService {

  async sendPaymentSuccess(
    email: string,
    bookingId: number
  ) {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Successful",
      text: `Dear Customer,

Your payment for Booking ID ${bookingId} was successful.

Your booking has been confirmed.

Thank you for choosing our Hotel.

Regards,
Hotel Management Team`,
    });

    logger.info(
      `Payment success email sent to ${email} for Booking ID ${bookingId}`
    );
  }

  async sendPaymentFailed(
    email: string,
    bookingId: number,
    reason: string
  ) {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Payment Failed",
      text: `Dear Customer,

Unfortunately your payment for Booking ID ${bookingId} has failed.

Reason:
${reason}

Please try again.

Regards,
Hotel Management Team`,
    });

    logger.info(
      `Payment failed email sent to ${email} for Booking ID ${bookingId}`
    );
  }

}