import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

const paymentController =
  new PaymentController();

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authMiddleware,
  roleMiddleware([1]), // ADMIN
  paymentController.getAll.bind(
    paymentController
  )
);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment found
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([1]), // ADMIN
  paymentController.getById.bind(
    paymentController
  )
);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create payment
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - amount
 *               - paymentMethod
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 5000
 *               paymentMethod:
 *                 type: string
 *                 example: UPI
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware([1, 2]), // ADMIN, CUSTOMER
  paymentController.create.bind(
    paymentController
  )
);

/**
 * @swagger
 * /payments/{id}/status:
 *   put:
 *     summary: Update payment status
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 example: SUCCESS
 *     responses:
 *       200:
 *         description: Payment status updated
 *       400:
 *         description: Invalid payment status
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware([1]), // ADMIN
  paymentController.updateStatus.bind(
    paymentController
  )
);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete payment
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([1]), // ADMIN
  paymentController.delete.bind(
    paymentController
  )
);

export default router;