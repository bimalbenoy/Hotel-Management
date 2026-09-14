import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import {
  authMiddleware,
  
} from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

const bookingController =
  new BookingController();

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: Number of bookings per page
 * 
 *     responses:
 *       200:
 *         description: List of bookings
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
  bookingController.getAll.bind(
    bookingController
  )
);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags:
 *       - Bookings
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
 *         description: Booking found
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([1, 2]), // ADMIN, CUSTOMER
  bookingController.getById.bind(
    bookingController
  )
);

/**
 * @swagger
 * /bookings/upload:
 *   post:
 *     summary: Upload a CSV file for bulk booking creation
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing booking details
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or invalid CSV file
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Internal server error
 */
router.post(
  "/upload", 
  authMiddleware,
  roleMiddleware([3]), // ADMIN only
  upload.single("file"),
  bookingController.uploadBookings.bind(
    bookingController
  )
);


/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags:
 *       - Bookings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomId
 *               - checkIn
 *               - checkOut
 *             properties:
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               checkIn:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-01"
 *               checkOut:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-05"
 *     responses:
 *       201:
 *         description: Booking created successfully
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
  roleMiddleware([1, 2,3]), // ADMIN, CUSTOMER
  bookingController.create.bind(
    bookingController
  )
);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     tags:
 *       - Bookings
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
 *         description: Booking cancelled successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware([1, 2]), // ADMIN, CUSTOMER
  bookingController.cancel.bind(
    bookingController
  )
);

export default router;