import { Request, Response } from "express";
import { PaymentService } from "../services/payment.services";

export class PaymentController {

  private paymentService =
    new PaymentService();

  async getAll(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const payments =
        await this.paymentService
          .getAllPayments();

      return res.status(200).json({
        success: true,
        data: payments,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  async getById(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const paymentId =
        Number(req.params.id);

      const payment =
        await this.paymentService
          .getPaymentById(
            paymentId
          );

      return res.status(200).json({
        success: true,
        data: payment,
      });

    } catch (error: any) {

      return res.status(404).json({
        success: false,
        message: error.message,
      });

    }
  }

  async create(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const {
        bookingId,
        amount,
        paymentMethod,
      } = req.body;

      const payment =
        await this.paymentService
          .createPayment(
            bookingId,
            amount,
            paymentMethod
          );

      return res.status(201).json({
        success: true,
        message:
          "Payment created successfully",
        data: payment,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  async updateStatus(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const paymentId =
        Number(req.params.id);

      const {
        paymentStatus,
      } = req.body;

      const payment =
        await this.paymentService
          .updatePaymentStatus(
            paymentId,
            paymentStatus
          );

      return res.status(200).json({
        success: true,
        message:
          "Payment status updated successfully",
        data: payment,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  async delete(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const paymentId =
        Number(req.params.id);

      await this.paymentService
        .deletePayment(
          paymentId
        );

      return res.status(200).json({
        success: true,
        message:
          "Payment deleted successfully",
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }
}