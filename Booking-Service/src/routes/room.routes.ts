import { Router } from "express";
import { RoomController } from "../controllers/room.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

const roomController = new RoomController();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rooms
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
  roleMiddleware([1,2]), // ADMIN
  roomController.getAll.bind(roomController)
);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags:
 *       - Rooms
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
 *         description: Room found
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([1, 2]), // ADMIN, CUSTOMER
  roomController.getById.bind(roomController)
);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a room
 *     tags:
 *       - Rooms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomNumber
 *               - roomTypesId
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: "101"
 *               roomTypesId:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: AVAILABLE
 *     responses:
 *       201:
 *         description: Room created successfully
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
  roomController.create.bind(roomController)
);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update room
 *     tags:
 *       - Rooms
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
 *               roomNumber:
 *                 type: string
 *               roomTypesId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([1,2]), // ADMIN
  roomController.update.bind(roomController)
);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete room
 *     tags:
 *       - Rooms
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
 *         description: Room deleted successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([1,2]), // ADMIN
  roomController.delete.bind(roomController)
);

export default router;