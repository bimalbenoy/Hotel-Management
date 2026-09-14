import client from "prom-client";



const register = new client.Registry();



client.collectDefaultMetrics({
  register,
});



export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",

  help: "Total number of HTTP requests",

  labelNames: [
    "method",
    "route",
    "status_code",
  ],

  registers: [register],
});

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",

  help: "HTTP request duration in seconds",

  labelNames: [
    "method",
    "route",
    "status_code",
  ],

  registers: [register],
});



export const kafkaMessagesProducedTotal =
  new client.Counter({
    name: "kafka_messages_produced_total",

    help:
      "Total number of Kafka messages successfully produced",

    labelNames: [
      "topic",
      "service",
    ],

    registers: [register],
  });


export const kafkaMessagesConsumedTotal =
  new client.Counter({
    name: "kafka_messages_consumed_total",

    help:
      "Total number of Kafka messages successfully consumed",

    labelNames: [
      "topic",
      "service",
    ],

    registers: [register],
  });



export const kafkaMessagesFailedTotal =
  new client.Counter({
    name: "kafka_messages_failed_total",

    help:
      "Total number of Kafka messages that failed",

    labelNames: [
      "topic",
      "service",
    ],

    registers: [register],
  });





export { register };