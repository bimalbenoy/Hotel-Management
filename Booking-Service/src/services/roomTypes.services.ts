import { RoomTypeRepository } from "../repositories/roomType.repository";
import { CacheService } from "./cache.service";
import { logger } from "../logger/logger.service";

export class RoomTypeServices {
  private roomTypeRepository = new RoomTypeRepository();

  private cacheService = new CacheService();

  private readonly CACHE_TTL = 300;

  private readonly ALL_ROOM_TYPES_KEY = "room-types:all";

  private getRoomTypeCacheKey(roomTypeId: number): string {
    return `room-types:${roomTypeId}`;
  }

  
  async getAllRoomTypes() {
    logger.info("RoomTypeServices.getAllRoomTypes called");

    
    const cachedRoomTypes = await this.cacheService.get<any[]>(
      this.ALL_ROOM_TYPES_KEY
    );

    
    if (cachedRoomTypes) {
      logger.info(
        "RoomTypeServices.getAllRoomTypes returned data from cache"
      );

      return cachedRoomTypes;
    }

    
    logger.info(
      "RoomTypeServices.getAllRoomTypes cache miss, fetching from database"
    );

    const roomTypes =
      await this.roomTypeRepository.getAllRoomTypes();

    
    await this.cacheService.set(
      this.ALL_ROOM_TYPES_KEY,
      roomTypes,
      this.CACHE_TTL
    );

    logger.info(
      `RoomTypeServices.getAllRoomTypes returned ${roomTypes.length} room types`
    );

    return roomTypes;
  }


  async getRoomTypeById(
    roomTypeId: number
  ) {
    logger.info(
      `RoomTypeServices.getRoomTypeById called for roomTypeId=${roomTypeId}`
    );

    const cacheKey =
      this.getRoomTypeCacheKey(roomTypeId);

    
    const cachedRoomType =
      await this.cacheService.get<any>(cacheKey);

    if (cachedRoomType) {
      logger.info(
        `RoomTypeServices.getRoomTypeById returned roomTypeId=${roomTypeId} from cache`
      );

      return cachedRoomType;
    }

    logger.info(
      `RoomTypeServices.getRoomTypeById cache miss for roomTypeId=${roomTypeId}`
    );

    const roomType =
      await this.roomTypeRepository
        .getRoomTypeById(roomTypeId);

    if (!roomType) {
      logger.error(
        `RoomTypeServices.getRoomTypeById failed: roomTypeId=${roomTypeId} not found`
      );

      throw new Error(
        "Room type not found"
      );
    }

    await this.cacheService.set(
      cacheKey,
      roomType,
      this.CACHE_TTL
    );

    logger.info(
      `RoomTypeServices.getRoomTypeById succeeded for roomTypeId=${roomTypeId}`
    );

    return roomType;
  }


  async createRoomType(
    typeName: string,
    pricePerNight: number,
    description: string
  ) {
    logger.info(
      `RoomTypeServices.createRoomType called for typeName=${typeName}`
    );

    if (pricePerNight <= 0) {
      logger.error(
        `RoomTypeServices.createRoomType failed: invalid pricePerNight=${pricePerNight}`
      );

      throw new Error(
        "Price must be greater than zero"
      );
    }

    const roomTypes =
      await this.roomTypeRepository
        .getAllRoomTypes();

    const exists =
      roomTypes.find(
        (roomType) =>
          roomType.type_name
            .toLowerCase() ===
          typeName.toLowerCase()
      );

    if (exists) {
      logger.error(
        `RoomTypeServices.createRoomType failed: typeName=${typeName} already exists`
      );

      throw new Error(
        "Room type already exists"
      );
    }

    const created =
      await this.roomTypeRepository
        .createRoomType(
          typeName,
          pricePerNight,
          description
        );

    /**
     * Important:
     * The list of room types has changed.
     * Invalidate the cached list.
     */
    await this.cacheService.delete(
      this.ALL_ROOM_TYPES_KEY
    );

    logger.info(
      `RoomTypeServices.createRoomType succeeded for typeName=${typeName}`
    );

    return created;
  }

  /**
   * Update room type
   */
  async updateRoomType(
    roomTypeId: number,
    typeName: string,
    pricePerNight: number,
    description: string
  ) {
    logger.info(
      `RoomTypeServices.updateRoomType called for roomTypeId=${roomTypeId}`
    );

    const roomType =
      await this.roomTypeRepository
        .getRoomTypeById(roomTypeId);

    if (!roomType) {
      logger.error(
        `RoomTypeServices.updateRoomType failed: roomTypeId=${roomTypeId} not found`
      );

      throw new Error(
        "Room type not found"
      );
    }

    
    const updated =
      await this.roomTypeRepository
        .updateRoomType(
          roomTypeId,
          typeName,
          pricePerNight,
          description
        );

 
    await this.cacheService.delete(
      this.getRoomTypeCacheKey(roomTypeId)
    );

    await this.cacheService.delete(
      this.ALL_ROOM_TYPES_KEY
    );

    logger.info(
      `RoomTypeServices.updateRoomType succeeded for roomTypeId=${roomTypeId}`
    );

    return updated;
  }

  /**
   * Delete room type
   */
  async deleteRoomType(
    roomTypeId: number
  ) {
    logger.info(
      `RoomTypeServices.deleteRoomType called for roomTypeId=${roomTypeId}`
    );

    const roomType =
      await this.roomTypeRepository
        .getRoomTypeById(roomTypeId);

    if (!roomType) {
      logger.error(
        `RoomTypeServices.deleteRoomType failed: roomTypeId=${roomTypeId} not found`
      );

      throw new Error(
        "Room type not found"
      );
    }

    // Delete from database
    const deleted =
      await this.roomTypeRepository
        .deleteRoomType(roomTypeId);

    /**
     * Invalidate individual cache
     */
    await this.cacheService.delete(
      this.getRoomTypeCacheKey(roomTypeId)
    );

    /**
     * Invalidate the list cache
     */
    await this.cacheService.delete(
      this.ALL_ROOM_TYPES_KEY
    );

    logger.info(
      `RoomTypeServices.deleteRoomType succeeded for roomTypeId=${roomTypeId}`
    );

    return deleted;
  }
}