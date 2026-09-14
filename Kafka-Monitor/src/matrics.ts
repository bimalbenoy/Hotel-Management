import client from "prom-client";



const register =
  new client.Registry();



client.collectDefaultMetrics({
  register,
});




export const kafkaConsumerLag =
  new client.Gauge({

    name:
      "kafka_consumer_lag",

    help:
      "Number of unprocessed Kafka messages for a consumer group",

    labelNames: [
      "topic",
      "consumer_group",
      "partition",
      "service",
    ],

    registers: [
      register
    ],

  });




export {
  register
};