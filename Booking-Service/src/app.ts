import express from "express";
import db from "./config/db";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.route";
import roleRoutes from "./routes/role.routes";
import roomTypeRoutes from "./routes/roomTypes.routes";
import roomRoutes from "./routes/room.routes";
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";
import { connectRedis } from "./config/redis";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import { kafkaMessagesFailedTotal } from "./metrics";

import { logger } from "./logger/logger.service";
import { apiRateLimiter } from "./middleware/rateLimit.middleware";

import { metricsMiddleware } from "./middleware/metrics.middlewares";
import { connectProducer } from "./kafka/producer";
import { startConsumer } from "./kafka/consumer";

import { register } from "./metrics";
import { startOutboxWorker } from "./outbox/outbox.worker";

const app = express();

const PORT = Number(process.env.PORT) || 3060;

// ======================================================
// Basic Express Middleware
// ======================================================

app.use(express.json());

// ======================================================
// Prometheus HTTP Metrics Middleware
// ======================================================
//
// This counts API requests and measures response time.
//
// Example:
// POST /bookings
// GET  /rooms
// POST /auth/login
//
// All of these will be recorded by Prometheus.
//

app.use(metricsMiddleware);

// ======================================================
// Prometheus Metrics Endpoint
// ======================================================
//
// Prometheus calls this endpoint periodically.
//
// IMPORTANT:
// metricsMiddleware ignores /metrics, so Prometheus
// scraping itself is not counted as an API request.
//

app.get("/metrics", async (req, res) => {
  try {
    res.setHeader(
      "Content-Type",
      register.contentType
    );

    res.end(
      await register.metrics()
    );

  } catch (error: any) {

    logger.error(
      `Failed to generate metrics: ${
        error?.message || error
      }`
    );

    res.status(500).end();
  }
});

// ======================================================
// Rate Limiter
// ======================================================
//
// /metrics is already handled above and is ignored by
// the metrics middleware.
//
// The rate limiter is applied to the normal API routes.
//

app.use((req, res, next) => {

  if (req.path === "/metrics") {
    return next();
  }

  apiRateLimiter(
    req,
    res,
    next
  );
});

// ======================================================
// Health Check
// ======================================================

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

// ======================================================
// Swagger
// ======================================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get(
  "/swagger.json",
  (req, res) => {
    res.json(swaggerSpec);
  }
);

// ======================================================
// Routes
// ======================================================

app.use(
  "/auth",
  authRoutes
);

app.use(
  "/users",
  userRoutes
);

app.use(
  "/roles",
  roleRoutes
);

app.use(
  "/room-types",
  roomTypeRoutes
);

app.use(
  "/rooms",
  roomRoutes
);

app.use(
  "/bookings",
  bookingRoutes
);

app.use(
  "/payments",
  paymentRoutes
);




// ======================================================
// Start Server
// ======================================================

async function startServer() {

  try {

    // Test database connection
    await db.raw("SELECT 1");

    logger.info(
      "Database Connected Successfully"
    );
    kafkaMessagesFailedTotal.labels(
  "booking.created",
  "booking-service"
);

kafkaMessagesFailedTotal.labels(
  "payment.result",
  "booking-service"
);

    // Kafka Producer
    //  kafkaMessagesFailedTotal.inc({
    //   topic: "booking.created",
    //   service: "booking-service",
    // });
    await connectProducer();
    //outbox loop
    startOutboxWorker();

    logger.info(
      "Booking Kafka Producer Connected"
    );

    // Kafka Consumer
    await startConsumer();

    logger.info(
      "Booking Kafka Consumer Connected"
    );
    await connectRedis();

    // Start Express
    app.listen(
      PORT,
      () => {

        logger.info(
          `Booking Service Running On Port ${PORT}`
        );

        logger.info(
          `Swagger: http://localhost:${PORT}/api-docs`
        );

        logger.info(
          `Metrics: http://localhost:${PORT}/metrics`
        );

        logger.info(
          `Health: http://localhost:${PORT}/`
        );
      }
    );

  } catch (err: any) {

    logger.error(
      "Failed to start Booking Service"
    );

    logger.error(
      err?.message || err
    );
  }
}

startServer();