import { Request, Response } from "express";
import { RoomTypeServices } from "../services/roomTypes.services";

export class RoomTypeController {

  private roomTypeService =
    new RoomTypeServices();

  async getAll(
    req: Request,
    res: Response
  ): Promise<Response> {

    try {

      const roomTypes =
        await this.roomTypeService
          .getAllRoomTypes();

      return res.status(200).json({
        success: true,
        data: roomTypes,
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

      const roomTypeId =
        Number(req.params.id);

      const roomType =
        await this.roomTypeService
          .getRoomTypeById(roomTypeId);

      return res.status(200).json({
        success: true,
        data: roomType,
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
        typeName,
        pricePerNight,
        description,
      } = req.body;

      const roomType =
        await this.roomTypeService
          .createRoomType(
            typeName,
            pricePerNight,
            description
          );

      return res.status(201).json({
        success: true,
        message:
          "Room type created successfully",
        data: roomType,
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

      const roomTypeId =
        Number(req.params.id);

      const {
        typeName,
        pricePerNight,
        description,
      } = req.body;

      const roomType =
        await this.roomTypeService
          .updateRoomType(
            roomTypeId,
            typeName,
            pricePerNight,
            description
          );

      return res.status(200).json({
        success: true,
        message:
          "Room type updated successfully",
        data: roomType,
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

      const roomTypeId =
        Number(req.params.id);

      await this.roomTypeService
        .deleteRoomType(roomTypeId);

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