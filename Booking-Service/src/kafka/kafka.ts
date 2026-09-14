import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "booking-service",
    brokers: ["172.23.74.113:9092"],
});