import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class CategoriaController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las categorias incluyendo el usuario, ordenadas por fecha
      // de forma descendiente, omitiendo el password del usuario
      const categoria = await this.prisma.categoria.findMany({});
      response.json(categoria);
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
      let idCategoria = parseInt(request.params.id);
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: idCategoria },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
        },
      });
      response.json(categoria);
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
