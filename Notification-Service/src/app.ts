import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger";
import notificationRoutes from "./routes/notification.routes";

import { startConsumer } from "./kafka/consumer";
import { register } from "./metrics";
import { metricsMiddleware } from "./middlewares/metrics.middlewares";
import { kafkaMessagesFailedTotal } from "./metrics";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3062;

// ======================================================
// Basic Express Middleware
// ======================================================

app.use(express.json());

// ======================================================
// Prometheus HTTP Metrics Middleware
// ======================================================
//
// Records:
// - Total HTTP requests
// - HTTP response time
// - HTTP status code
// - HTTP method
//
// /metrics itself is ignored inside metricsMiddleware
// so Prometheus scraping does not increase request count.
//

app.use(metricsMiddleware);

// ======================================================
// Prometheus Metrics Endpoint
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

    console.error(
      "Failed to generate metrics:",
      error?.message || error
    );

    res.status(500).end();
  }
});

// ======================================================
// Health Check
// ======================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notification Service Running",
  });
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
// Notification Routes
// ======================================================

app.use(
  "/",
  notificationRoutes
);

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

    console.error(
      "Unhandled error:",
      err?.message || err
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
// Start Notification Service
// ======================================================

async function startServer() {

  try {
    //  kafkaMessagesFailedTotal.inc({
    //   topic: "payment.result",
    //   service: "notification-service",
    // });
    

    // Start Kafka Consumer
    await startConsumer();

    console.log(
      "Notification Kafka Consumer Connected"
    );

    // Start Express Server
    app.listen(
      PORT,
      () => {

        console.log(
          `Notification Service running on port ${PORT}`
        );

        console.log(
          `Swagger: http://localhost:${PORT}/api-docs`
        );

        console.log(
          `Metrics: http://localhost:${PORT}/metrics`
        );

        console.log(
          `Health: http://localhost:${PORT}/health`
        );
      }
    );

  } catch (error: any) {

    console.error(
      "Failed to start Notification Service"
    );

    console.error(error);

    process.exit(1);
  }
}

startServer();