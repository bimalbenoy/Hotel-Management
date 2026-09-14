import db from "../config/db";

export class RoomRepository{
    async getAllRooms(){
        return await db("Rooms").select("*");
    }
    async getRoomById(roomId:number){
        return await db("Rooms").where({room_id:roomId}).first();

    }
    async createRoom(
    roomNumber: string,
    roomTypesId: number,
    status: string
  ) {
    const [room] = await db("Rooms")
      . insert({
        room_number: roomNumber,
        room_types_id: roomTypesId,
        status,
      })
      .returning("*");

    return room;
  }
  async updateRoom(
    roomId: number,
    roomNumber: string,
    roomTypesId: number,
    status: string
  ) {
    const [room] = await db("Rooms")
      .where({
        room_id: roomId,
      })
      .update({
        room_number: roomNumber,
        room_types_id: roomTypesId,
        status,
      })
      .returning("*");

    return room;
  }
  async deleteRoom(roomId: number) {
    return await db("Rooms")
      .where({
        room_id: roomId,
      })
      .delete();
  }
  async findByRoomNumber(
  roomNumber: string
) {

  return await db("rooms")
    .where({
      room_number: roomNumber,
    })
    .first();

}

}