import { Request, Response } from "express";
import { RoomService } from "../services/room.service";

export class RoomController {

  private roomService =
    new RoomService();

  async getAll(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const rooms =
        await this.roomService
          .getAllRooms();

      return res.status(200).json({
        success: true,
        data: rooms,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  async getById(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const roomId =
        Number(req.params.id);

      const room =
        await this.roomService
          .getRoomById(roomId);

      return res.status(200).json({
        success: true,
        data: room,
      });

    } catch (error: any) {

      return res.status(404).json({
        success: false,
        message: error.message,
      });

    }
  }

  async create(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const {
        roomNumber,
        roomTypesId,
        status,
      } = req.body;

      const room =
        await this.roomService
          .createRoom(
            roomNumber,
        roomTypesId,
        status,
          );

      return res.status(201).json({
        success: true,
        message:
          "Room created successfully",
        data: room,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  async update(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const roomId =
        Number(req.params.id);

      const {
        roomNumber,
        roomTypesId,
        status,
      } = req.body;

      const room =
        await this.roomService
          .updateRoom(
            roomId,
            roomNumber,
        roomTypesId,
        status,
          );

      return res.status(200).json({
        success: true,
        message:
          "Room updated successfully",
        data: room,
      });   

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  async delete(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const roomId =
        Number(req.params.id);

      await this.roomService
        .deleteRoom(roomId);

      return res.status(200).json({
        success: true,
        message:
          "Room type deleted successfully",
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }
}