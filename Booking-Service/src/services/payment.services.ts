import { PaymentRepository } from "../repositories/payment.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { logger } from "../logger/logger.service";


export class PaymentService {

  private paymentRepository =
    new PaymentRepository();

  private bookingRepository =
    new BookingRepository();

  async getAllPayments() {
    logger.info("PaymentService.getAllPayments called");
    return await this.paymentRepository
      .getAllPayments();
  }

  async getPaymentById(
    paymentId: number
  ) {

    const payment =
      await this.paymentRepository
        .getPaymentById(paymentId);

    if (!payment) {
      logger.error(`PaymentService.getPaymentById failed: paymentId=${paymentId} not found`);
      throw new Error(
        "Payment not found"
      );
    }

    return payment;
  }

  async createPayment(
    bookingId: number,
    amount: number,
    paymentMethod: string
  ) {
    logger.info(`PaymentService.createPayment called for bookingId=${bookingId}, amount=${amount}`);

    const booking =
      await this.bookingRepository
        .getBookingById(bookingId);

    if (!booking) {
      logger.error(`PaymentService.createPayment failed: bookingId=${bookingId} not found`);
      throw new Error(
        "Booking not found"
      );
    }

    if (amount <= 0) {
      logger.error(`PaymentService.createPayment failed: invalid amount=${amount} for bookingId=${bookingId}`);
      throw new Error(
        "Amount must be greater than zero"
      );
    }

   

    

    const payment = await this.paymentRepository
      .createPayment(
        bookingId,
        amount,
        paymentMethod
      );
    logger.info(`PaymentService.createPayment succeeded for bookingId=${bookingId}`);
    return payment;
  }

  async updatePaymentStatus(
    paymentId: number,
    paymentStatus: string
  ) {
    logger.info(`PaymentService.updatePaymentStatus called for paymentId=${paymentId}, status=${paymentStatus}`);

    const payment =
      await this.paymentRepository
        .getPaymentById(
          paymentId
        );

    if (!payment) {
      logger.error(`PaymentService.updatePaymentStatus failed: paymentId=${paymentId} not found`);
      throw new Error(
        "Payment not found"
      );
      
    }

    const validStatuses = [
      "PENDING",
      "SUCCESS",
      "FAILED",
      "REFUNDED",
    ];

    if (
      !validStatuses.includes(
        paymentStatus
      )
    ) {
      logger.error(`PaymentService.updatePaymentStatus failed: invalid status=${paymentStatus} for paymentId=${paymentId}`);
      throw new Error(
        "Invalid payment status"
      );
    }

    const updatedPayment = await this.paymentRepository
      .updatePaymentStatus(
        paymentId,
        paymentStatus
      );
    logger.info(`PaymentService.updatePaymentStatus succeeded for paymentId=${paymentId}`);
    return updatedPayment;
  }

  async deletePayment(
    paymentId: number
  ) {
    logger.info(`PaymentService.deletePayment called for paymentId=${paymentId}`);

    const payment =
      await this.paymentRepository
        .getPaymentById(
          paymentId
        );

    if (!payment) {
      logger.error(`PaymentService.deletePayment failed: paymentId=${paymentId} not found`);
      throw new Error(
        "Payment not found"
      );
    }

    const deleted = await this.paymentRepository
      .deletePayment(
        paymentId
      );
    logger.info(`PaymentService.deletePayment succeeded for paymentId=${paymentId}`);
    return deleted;
  }
}