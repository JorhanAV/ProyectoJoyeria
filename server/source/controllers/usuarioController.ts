import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class UsuarioController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las resenas incluyendo el usuario, ordenadas por fecha
      // de forma descendiente, omitiendo el password del usuario
      const usuario = await this.prisma.usuario.findMany({
        
      });
      response.json(usuario);
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
      let idUsuario = parseInt(request.params.id);
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: idUsuario },
        select: {
          id: true,
          nombre_usuario: true,
          correo: true,
          contraseña: false, // No devolver la contraseña
          rol: true,
        },
      });
      response.json(usuario);
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
