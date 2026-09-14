import { RoomRepository } from "../repositories/room.repository";
import { RoomTypeRepository } from "../repositories/roomType.repository";
import { logger } from "../logger/logger.service";

export class RoomService {

  private roomRepository =
    new RoomRepository();

  private roomTypeRepository =
    new RoomTypeRepository();

  async getAllRooms() {
    logger.info("RoomService.getAllRooms called");
    return await this.roomRepository
      .getAllRooms();
  }

  async getRoomById(roomId: number) {
    logger.info(`RoomService.getRoomById called for roomId=${roomId}`);

    const room =
      await this.roomRepository
        .getRoomById(roomId);

    if (!room) {
      logger.error(`RoomService.getRoomById failed: roomId=${roomId} not found`);
      throw new Error(
        "Room not found"
      );
    }

    return room;
  }

  async createRoom(
    roomNumber: string,
    roomTypesId: number,
    status: string
  ) {
    logger.info(`RoomService.createRoom called for roomNumber=${roomNumber}, roomTypeId=${roomTypesId}`);

    const roomType =
      await this.roomTypeRepository
        .getRoomTypeById(roomTypesId);

    if (!roomType) {
      logger.error(`RoomService.createRoom failed: roomTypeId=${roomTypesId} not found`);
      throw new Error(
        "Room Type not found"
      );
    }

    const rooms =
      await this.roomRepository
        .getAllRooms();

    const roomExists =
      rooms.find(
        room =>
          room.room_number ===
          roomNumber
      );

    if (roomExists) {
      logger.error(`RoomService.createRoom failed: roomNumber=${roomNumber} already exists`);
      throw new Error(
        "Room number already exists"
      );
    }

    const created = await this.roomRepository
      .createRoom(
        roomNumber,
        roomTypesId,
        status
      );
    logger.info(`RoomService.createRoom succeeded for roomNumber=${roomNumber}`);
    return created;
  }

  async updateRoom(
    roomId: number,
    roomNumber: string,
    roomTypesId: number,
    status: string
  ) {
    logger.info(`RoomService.updateRoom called for roomId=${roomId}`);

    const room =
      await this.roomRepository
        .getRoomById(roomId);

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    const updated = await this.roomRepository
      .updateRoom(
        roomId,
        roomNumber,
        roomTypesId,
        status
      );
    logger.info(`RoomService.updateRoom succeeded for roomId=${roomId}`);
    return updated;
  }

  async deleteRoom(
    roomId: number
  ) {
    logger.info(`RoomService.deleteRoom called for roomId=${roomId}`);

    const room =
      await this.roomRepository
        .getRoomById(roomId);

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    const deleted = await this.roomRepository
      .deleteRoom(roomId);
    logger.info(`RoomService.deleteRoom succeeded for roomId=${roomId}`);
    return deleted;
  }
}