import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class VarianteDetalleController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todos los detalles de variantes
      const detalles = await this.prisma.varianteDetalle.findMany({});
      response.json(detalles);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id_productoPersonalizable, id_valor } = request.body;
      const nuevoDetalle = await this.prisma.varianteDetalle.create({
        data: {
            productoPersonalizable:{
                connect: { id: id_productoPersonalizable }
            },
            valor: {
                connect: { id: id_valor }
            }
        }
      });
      response.status(201).json(nuevoDetalle);
    } catch (error) {
      next(error);
    }
  };
}
