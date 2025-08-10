import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class productoPersonalizableController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todos los detalles de variantes
      const productoPersonalizable = await this.prisma.productoPersonalizable.findMany({});
      response.json(productoPersonalizable);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const nuevoProductoPersonalizable = await this.prisma.productoPersonalizable.create({
        data: {
            nombre: request.body.nombre,
            descripcion_general: request.body.descripcion_general,
            categoria:{
                connect: { id: request.body.id_categoria }
            },
            producto_base:{
                connect: { id: request.body.id_producto_base}
            },
        }
      });
      response.status(201).json(nuevoProductoPersonalizable);
    } catch (error) {
      next(error);
    }
  };
}
