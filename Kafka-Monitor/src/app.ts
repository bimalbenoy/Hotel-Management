import express from "express";

import {
  register,
} from "./matrics";

import {
  updateConsumerLag,
} from "./kafka/consumerLag";


// ======================================================
// Express Application
// ======================================================

const app =
  express();

const PORT =
  3070;


// ======================================================
// Prometheus Metrics Endpoint
// ======================================================

app.get(
  "/metrics",
  async (req, res) => {

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
        `Failed to generate metrics: ${
          error?.message || error
        }`
      );

      res.status(500).end();

    }
  }
);


// ======================================================
// Health Check
// ======================================================

app.get(
  "/",
  (req, res) => {

    res.send(
      "Kafka Monitor Running"
    );

  }
);


// ======================================================
// Start Kafka Monitor
// ======================================================

async function startMonitor() {

  try {

    // --------------------------------------------------
    // Calculate initial Kafka lag
    // --------------------------------------------------

    await updateConsumerLag();


    // --------------------------------------------------
    // Recalculate Kafka lag every 5 seconds
    // --------------------------------------------------

    setInterval(
      async () => {

        try {

          await updateConsumerLag();

        } catch (error: any) {

          console.error(
            `Kafka lag update failed: ${
              error?.message || error
            }`
          );

        }

      },
      5000
    );


    // --------------------------------------------------
    // Start HTTP server
    // --------------------------------------------------

    app.listen(
      PORT,
      () => {

        console.log(
          `Kafka Monitor running on port ${PORT}`
        );

        console.log(
          `Metrics: http://localhost:${PORT}/metrics`
        );

      }
    );

  } catch (error: any) {

    console.error(
      `Failed to start Kafka Monitor: ${
        error?.message || error
      }`
    );

    process.exit(1);

  }
}


startMonitor();