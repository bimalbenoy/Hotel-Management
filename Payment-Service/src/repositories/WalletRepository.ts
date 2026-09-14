import db from "../config/db";

export class WalletRepository {

  async createWallet(userId: number) {
    const [wallet] = await db("wallets")
      .insert({
        user_id: userId,
        balance: 0,
      })
      .returning("*");

    return wallet;
  }

  async getWalletByUserId(userId: number) {
    const wallet = await db("wallets")
      .where({ user_id: userId })
      .first();

    return wallet;
  }

  async updateBalance(userId: number, balance: number) {
    const [wallet] = await db("wallets")
      .where({ user_id: userId })
      .update({
        balance,
        updated_at: new Date(),
      })
      .returning("*");

    return wallet;
  }

  async deleteWallet(userId: number) {
    return await db("wallets")
      .where({ user_id: userId })
      .del();
  }
}