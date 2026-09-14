import db from "../config/db"

export class RoomTypeRepository{
    //get all value from the table
    async getAllRoomTypes(){
        return await db("Room_types").select("*");

    }
    //get room by id
    async getRoomTypeById(roomTypeId:number){
        return await db("Room_types").where({room_types_id:roomTypeId}).first();


    }
    //create room type
    async createRoomType(
        typeName:string,
        pricePerNight:number,
        description:string
    ){
        const [roomType]=
        await db("Room_types").insert({
            type_name:typeName,
            price_per_night:pricePerNight,
            description
        }).returning("*");
        return roomType;
    }
    //update room type
    async updateRoomType(
  roomTypeId: number,
  typeName: string,
  pricePerNight: number,
  description: string
) {

  const [roomType] =
    await db("Room_types")
      .where({
        room_types_id:
          roomTypeId,
      })
      .update({
        type_name: typeName,
        price_per_night:
          pricePerNight,
        description,
      })
      .returning("*");

  return roomType;
}

//delete
async deleteRoomType(
  roomTypeId: number
) {

  return await db("Room_types")
    .where({
      room_types_id:
        roomTypeId,
    })
    .delete();
}

}