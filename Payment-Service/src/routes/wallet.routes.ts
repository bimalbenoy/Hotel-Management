import { Router } from "express";
import { body, param } from "express-validator";
import { WalletController } from "../controllers/Wallet.controllers";
import { validate } from "../middlewares/validate.middlewares";

const router = Router();
const walletController = new WalletController();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet Management APIs
 */

/**
 * @swagger
 * /wallet:
 *   post:
 *     summary: Create a wallet
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       400:
 *         description: Bad Request
 */
router.post(
  "/",
  body("userId")
    .isInt({ min: 1 })
    .withMessage("Valid userId is required"),
  validate,
  walletController.createWallet.bind(walletController)
);

/**
 * @swagger
 * /wallet/add-money:
 *   post:
 *     summary: Add money to wallet
 *     tags: [Wallet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - amount
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Money added successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Wallet not found
 */
router.post(
  "/add-money",
  body("userId")
    .isInt({ min: 1 })
    .withMessage("Valid userId is required"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  validate,
  walletController.addMoney.bind(walletController)
);

/**
 * @swagger
 * /wallet/{userId}:
 *   get:
 *     summary: Get wallet by user ID
 *     tags: [Wallet]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Wallet details
 *       404:
 *         description: Wallet not found
 */
router.get(
  "/:userId",
  param("userId")
    .isInt({ min: 1 })
    .withMessage("Valid userId is required"),
  validate,
  walletController.getWallet.bind(walletController)
);

export default router;