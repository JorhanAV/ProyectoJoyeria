import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class categoriaController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las categorias incluyendo el usuario, ordenadas por fecha 
      // de forma descendiente, omitiendo el password del usuario
      const categoria= await this.prisma.categoria.findMany({
        select:{
          id: true,
          nombre:true,
          descripcion:true
        }
      })
      response.json(categoria)
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
     
    } catch (error: any) {

      next(error)
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