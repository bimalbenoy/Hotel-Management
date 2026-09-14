import { PaymentRepository } from "../repositories/PaymentRepository";
import { WalletService } from "../services/Wallet.services";


import { logger } from "../logger/logger.service";


export class PaymentService {

  private paymentRepository =
    new PaymentRepository();
  private walletService=new WalletService();

  

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
  userId: number,
  amount: number,
  paymentMethod: string
) {
  logger.info(
    `PaymentService.createPayment called for bookingId=${bookingId}, amount=${amount}`
  );

  
  const existingPayment =
    await this.paymentRepository.getPaymentByBookingId(bookingId);

  if (existingPayment) {
    logger.info(
      `Payment already exists for bookingId=${bookingId}, ` +
      `paymentId=${existingPayment.payment_id}. ` +
      `Skipping wallet deduction.`
    );

    return existingPayment;
  }

  
  if (!paymentMethod || paymentMethod.trim().length === 0) {
    logger.error(
      `PaymentService.createPayment failed: ` +
      `paymentMethod is required for bookingId=${bookingId}`
    );

    throw new Error("Payment method is required");
  }

  // 3. Validate amount
  if (amount <= 0) {
    logger.error(
      `PaymentService.createPayment failed: ` +
      `invalid amount=${amount} for bookingId=${bookingId}`
    );

    throw new Error("Amount must be greater than zero");
  }

  
  const existingWallet =
    await this.walletService.getWallet(userId);

  if (Number(existingWallet.balance) < amount) {
    logger.error(
      `PaymentService.createPayment failed: ` +
      `insufficient balance=${existingWallet.balance} ` +
      `for bookingId=${bookingId}`
    );

    throw new Error("Insufficient Balance");
  }

  const payment =
    await this.paymentRepository.createPayment(
      bookingId,
      amount,
      paymentMethod.trim()
    );

  await this.walletService.deductMoney(
    userId,
    amount
  );

  const updatedPayment =
    await this.paymentRepository.updatePaymentStatus(
      payment.payment_id,
      "SUCCESS"
    );

  logger.info(
    `PaymentService.createPayment succeeded for ` +
    `bookingId=${bookingId} ` +
    `paymentId=${payment.payment_id}`
  );

  return updatedPayment;
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