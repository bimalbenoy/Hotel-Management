import express from "express";
import dotenv from "dotenv";
import db from "./config/db";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

import walletRoutes from "./routes/wallet.routes";
import paymentRoutes from "./routes/payment.routes";

import { logger } from "./logger/logger.service";
import { startConsumer } from "./kafka/consumer";
import { connectProducer } from "./kafka/producer";

import { register } from "./metrics";
import { metricsMiddleware } from "./middlewares/metrics.middlewares";
import { kafkaMessagesFailedTotal } from "./metrics";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3061;

// ======================================================
// Middleware
// ======================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Prometheus HTTP metrics middleware
app.use(metricsMiddleware);

// ======================================================
// Prometheus Metrics
// ======================================================

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
      `Failed to generate metrics: ${error.message}`
    );

    res.status(500).end();
  }
});

// ======================================================
// Swagger
// ======================================================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ======================================================
// Routes
// ======================================================

app.use(
  "/wallet",
  walletRoutes
);

app.use(
  "/payments",
  paymentRoutes
);

// ======================================================
// Health Check
// ======================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment Service Running",
  });
});

// ======================================================
// Root Route
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment Service Running",
  });
});

// ======================================================
// 404 Handler
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ======================================================
// Global Error Handler
// ======================================================

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(
      `Unhandled error: ${
        err?.message || "Unknown error"
      }`
    );

    res.status(
      err?.statusCode || 500
    ).json({
      success: false,
      message:
        err?.message ||
        "Internal server error",
    });
  }
);

// ======================================================
// Start Server
// ======================================================

async function startServer() {
  try {

    // Test database connection
    await db.raw("SELECT 1");

    logger.info(
      "Payment Database Connected"
    );
    kafkaMessagesFailedTotal.labels(
  "booking.created",
  "payment-service"
);

kafkaMessagesFailedTotal.labels(
  "payment.result",
  "payment-service"
);

    // Connect Kafka Producer
    await connectProducer();

    logger.info(
      "Payment Kafka Producer Connected"
    );

    // Start Kafka Consumer
    await startConsumer();

    logger.info(
      "Payment Kafka Consumer Connected"
    );

    // Start Express Server
    app.listen(
      PORT,
      () => {

        logger.info(
          `Payment Service running on port ${PORT}`
        );

        logger.info(
          `Swagger: http://localhost:${PORT}/api-docs`
        );

        logger.info(
          `Metrics: http://localhost:${PORT}/metrics`
        );

        logger.info(
          `Health: http://localhost:${PORT}/health`
        );
      }
    );

  } catch (error: any) {

    logger.error(
      `Failed to start Payment Service: ${
        error?.message || error
      }`
    );

    console.error(error);

    process.exit(1);
  }
}

startServer();