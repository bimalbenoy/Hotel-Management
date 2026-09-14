import { Request, Response } from "express";
import { WalletService } from "../services/Wallet.services";

export class WalletController {

  private walletService = new WalletService();

  async createWallet(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const wallet = await this.walletService.createWallet(userId);

      res.status(201).json({
        message: "Wallet created successfully",
        wallet,
      });

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getWallet(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      const wallet = await this.walletService.getWallet(userId);

      res.status(200).json(wallet);

    } catch (error: any) {
      res.status(404).json({
        message: error.message,
      });
    }
  }

  async addMoney(req: Request, res: Response) {
    try {
      const { userId, amount } = req.body;

      const wallet = await this.walletService.addMoney(
        userId,
        amount
      );

      res.status(200).json({
        message: "Money added successfully",
        wallet,
      });

    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}