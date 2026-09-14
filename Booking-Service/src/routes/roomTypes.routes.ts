import { Router } from "express";
import { RoomTypeController } from "../controllers/roomType.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

const roomTypeController =
  new RoomTypeController();

/**
 * @swagger
 * /room-types:
 *   get:
 *     summary: Get all room types
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of room types
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
  roleMiddleware([1,3,2]), // ADMIN
  roomTypeController.getAll.bind(
    roomTypeController
  )
);

/**
 * @swagger
 * /room-types/{id}:
 *   get:
 *     summary: Get room type by ID
 *     tags:
 *       - Room Types
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
 *         description: Room type found
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([1, 2]), // ADMIN, CUSTOMER
  roomTypeController.getById.bind(
    roomTypeController
  )
);

/**
 * @swagger
 * /room-types:
 *   post:
 *     summary: Create room type
 *     tags:
 *       - Room Types
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeName:
 *                 type: string
 *                 example: Deluxe
 *               pricePerNight:
 *                 type: number
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: Sea View Room
 *     responses:
 *       201:
 *         description: Room type created
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
  roleMiddleware([1,2]), // ADMIN
  roomTypeController.create.bind(
    roomTypeController
  )
);

/**
 * @swagger
 * /room-types/{id}:
 *   put:
 *     summary: Update room type
 *     tags:
 *       - Room Types
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
 *               typeName:
 *                 type: string
 *               pricePerNight:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room type updated
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([1,2]), // ADMIN
  roomTypeController.update.bind(
    roomTypeController
  )
);

/**
 * @swagger
 * /room-types/{id}:
 *   delete:
 *     summary: Delete room type
 *     tags:
 *       - Room Types
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
 *         description: Room type deleted
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room type not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([1,2]), // ADMIN
  roomTypeController.delete.bind(
    roomTypeController
  )
);

export default router;