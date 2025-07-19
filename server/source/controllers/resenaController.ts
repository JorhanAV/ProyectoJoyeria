import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class ResenaController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las resenas incluyendo el usuario, ordenadas por fecha
      // de forma descendiente, omitiendo el password del usuario
      const resena = await this.prisma.resena.findMany({
        include: {
          usuario: {
            omit: {
              contraseña: true,
            },
          },
          producto: {
            select: {
              imagenes: true,
            },
          },
        },
        orderBy: {
          fecha: "desc",
        },
      });
      response.json(resena);
    } catch (error) {
      next(error);
    }
  };
  //Obtener por Id
  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      let idResena = parseInt(request.params.id);
      const resena = await this.prisma.resena.findUnique({
        where: { id: idResena },
        include: {
          usuario: {
            omit: { contraseña: true },
          },
          producto: {
            select: {
              nombre: true,
              descripcion: true,
              imagenes: true,
            },
          },
        },
      });
      response.json(resena);
    } catch (error: any) {
      next(error);
    }
  };
  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;

      const nuevaResena = await this.prisma.resena.create({
        data: {
          visible: body.visible,
          comentario: body.comentario,
          valoracion: body.valoracion,
          fecha: new Date(body.fecha), 
          usuario: {
            connect: {
              id: body.usuario_id, 
            },
          },
          producto: {
            connect: {
              id: body.producto_id,
            },
          },
        },
      });

      response.status(201).json(nuevaResena);
    } catch (error) {
      next(error);
    }
  };
}
