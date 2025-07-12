import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class EtiquetaController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las etiquetas incluyendo el usuario, ordenadas por fecha
      // de forma descendiente, omitiendo el password del usuario
      const etiquetas = await this.prisma.etiqueta.findMany({});
      response.json(etiquetas);
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
      let idEtiqueta = parseInt(request.params.id);
      const etiqueta = await this.prisma.etiqueta.findUnique({
        where: { id: idEtiqueta },
        select: {
          id: true,
          nombre: true
        },
      });
      response.json(etiqueta);
    } catch (error: any) {
      next(error);
    }
  };
  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  };
}
