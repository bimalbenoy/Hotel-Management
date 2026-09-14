import { WalletRepository } from "../repositories/WalletRepository";

export class WalletService {

  private walletRepository = new WalletRepository();

  async createWallet(userId: number) {

    const existingWallet =
      await this.walletRepository.getWalletByUserId(userId);

    if (existingWallet) {
      throw new Error("Wallet already exists");
    }

    return await this.walletRepository.createWallet(userId);
  }

  async getWallet(userId: number) {

    const wallet =
      await this.walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return wallet;
  }

  async addMoney(userId: number, amount: number) {

    const wallet =
      await this.walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    const newBalance = Number(wallet.balance) + amount;

    return await this.walletRepository.updateBalance(
      userId,
      newBalance
    );
  }

  async deductMoney(userId: number, amount: number) {

    const wallet =
      await this.walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (Number(wallet.balance) < amount) {
      throw new Error("Insufficient wallet balance");
    }

    const newBalance = Number(wallet.balance) - amount;

    return await this.walletRepository.updateBalance(
      userId,
      newBalance
    );
  }

}