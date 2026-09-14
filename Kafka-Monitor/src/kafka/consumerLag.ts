import { kafka } from "./kafka";

import {
  kafkaConsumerLag,
} from "../matrics";

const admin =
  kafka.admin();




const monitoredConsumers = [

  {
    topic: "booking.created",

    consumerGroup:
      "payment-group",

    service:
      "payment-service",
  },

  {
    topic: "payment.result",

    consumerGroup:
      "booking-group",

    service:
      "booking-service",
  },

  {
    topic: "payment.result",

    consumerGroup:
      "notification-group",

    service:
      "notification-service",
  },

];


// ======================================================
// Update Kafka Consumer Lag
// ======================================================

export async function updateConsumerLag() {

  let isConnected = false;

  try {

 

    await admin.connect();

    isConnected = true;




    for (
      const consumer
      of monitoredConsumers
    ) {

      const topic =
        consumer.topic;

      const consumerGroup =
        consumer.consumerGroup;

      const service =
        consumer.service;




      const topicOffsets =
        await admin.fetchTopicOffsets(
          topic
        );


    

      const groupOffsets =
        await admin.fetchOffsets({

          groupId:
            consumerGroup,

          topics: [
            topic
          ],

        });


  

      const groupTopicOffset =
        groupOffsets.find(
          (offset) =>
            offset.topic === topic
        );


    

      for (
        const topicOffset
        of topicOffsets
      ) {

        const partition =
          topicOffset.partition;


      

        const latestOffset =
          Number(
            topicOffset.high
          );


       

        const groupOffset =
          groupTopicOffset?.partitions.find(
            (offset) =>
              offset.partition === partition
          );


       
        const rawCommittedOffset =
          Number(
            groupOffset?.offset ?? -1
          );


        const committedOffset =
          rawCommittedOffset === -1
            ? 0
            : rawCommittedOffset;


       

        const lag =
          Math.max(
            latestOffset -
              committedOffset,
            0
          );


        

        kafkaConsumerLag.set(

          {
            topic,

            consumer_group:
              consumerGroup,

            partition:
              String(partition),

            service,

          },

          lag

        );


       
        console.log(
          `Consumer lag updated | ` +
          `service=${service} | ` +
          `topic=${topic} | ` +
          `consumerGroup=${consumerGroup} | ` +
          `partition=${partition} | ` +
          `latestOffset=${latestOffset} | ` +
          `committedOffset=${committedOffset} | ` +
          `lag=${lag}`
        );

      }
    }

  } catch (error: any) {

    console.error(
      `Failed to update Kafka consumer lag: ` +
      `${error?.message || error}`
    );

  } finally {


    if (isConnected) {

      await admin.disconnect();

    }

  }
}