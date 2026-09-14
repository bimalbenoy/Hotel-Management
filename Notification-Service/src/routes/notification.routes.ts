import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Notification Service Health Check
 *     tags:
 *       - Notification
 *     responses:
 *       200:
 *         description: Service is running
 */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Notification Service Running",
  });
});

export default router;