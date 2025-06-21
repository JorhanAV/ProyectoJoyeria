import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class ResenaController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las resenas incluyendo el usuario, ordenadas por fecha 
      // de forma ascendente, omitiendo el password del usuario
      const ordenes= await this.prisma.resena.findMany({
        include:{
          usuario:{
            omit:{
              contraseña:true
            }
          }
          
        },
        orderBy:{
          fecha:'desc'
        }
      })
      response.json(ordenes)
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
      let idOrden=parseInt(request.params.id)
      const orden= await this.prisma.resena.findUnique({
        where:{id: idOrden},
        include:{
          usuario:{
            omit:{ contraseña:true},
          },
          producto:{
            select:{
                nombre:true,
                descripcion:true,
            }
          }
        }
      })
      response.json(orden)
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