import db from "../config/db";
import { Knex } from "knex";

export class OutboxRepository {

  async createEvent(
    eventType: string,
    aggregateId: string,
    payload: string,
    trx: Knex.Transaction
  ) {
    const [event] = await trx("outbox_events")
      .insert({
        event_type: eventType,
        aggregate_id: aggregateId,
        payload,
        status: "PENDING",
        attempts: 0,
      })
      .returning("*");

    return event;
  }

  async getPendingEvents(limit: number = 10) {
    return await db("outbox_events")
      .where("status", "PENDING")
      .orderBy("created_at", "asc")
      .limit(limit);
  }

  async markPublished(eventId: number) {
    await db("outbox_events")
      .where("event_id", eventId)
      .update({
        status: "PUBLISHED",
        published_at: db.fn.now(),
      });
  }

  async markFailed(eventId: number, error: string) {
    await db("outbox_events")
      .where("event_id", eventId)
      .update({
        status: "PENDING",
        attempts: db.raw("attempts + 1"),
        last_error: error,
      });
  }
}