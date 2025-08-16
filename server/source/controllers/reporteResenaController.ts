import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class ReporteResenaController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const reporteResena = await this.prisma.reporteResena.findMany({
        include: {
          resena: {
            select: {
              comentario: true,
              valoracion: true,
              fecha: true,
              usuario: {
                select: {
                  id: true,
                  nombre_usuario: true,
                },
              },
            },
          },
          usuario: {
            select: {
              nombre_usuario: true,
            },
          },
        },
      });

      response.json(reporteResena);
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
      let idReporteResena = parseInt(request.params.id);
      const resena = await this.prisma.reporteResena.findUnique({
        where: { id: idReporteResena },
        include: {
          usuario: {
            omit: { contraseña: true },
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

      const nuevaResena = await this.prisma.reporteResena.create({
        data: {
          comentario: body.comentario,
          resena: {
            connect: {
              id: body.resena_id,
            },
          },
          usuario: {
            connect: {
              id: body.usuario_id,
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
