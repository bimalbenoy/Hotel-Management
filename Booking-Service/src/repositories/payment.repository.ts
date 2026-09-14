import db from "../config/db";

export class PaymentRepository {

  async getAllPayments() {
    return await db("payments")
      .select("*");
  }

  async getPaymentById(
    paymentId: number
  ) {
    return await db("payments")
      .where({
        payment_id: paymentId,
      })
      .first();
  }

  async getPaymentByBookingId(
    bookingId: number
  ) {
    return await db("payments")
      .where({
        booking_id: bookingId,
      })
      .first();
  }

  async createPayment(
    bookingId: number,
    amount: number,
    paymentMethod: string
  ) {

    const [payment] =
      await db("payments")
        .insert({
          booking_id: bookingId,
          amount,
          payment_method:
            paymentMethod,
          payment_status:
            "PENDING",
        })
        .returning("*");

    return payment;
  }

  async updatePaymentStatus(
    paymentId: number,
    paymentStatus: string
  ) {

    const [payment] =
      await db("payments")
        .where({
          payment_id: paymentId,
        })
        .update({
          payment_status:
            paymentStatus,
        })
        .returning("*");

    return payment;
  }

  async deletePayment(
    paymentId: number
  ) {

    return await db("payments")
      .where({
        payment_id: paymentId,
      })
      .delete();
  }
}