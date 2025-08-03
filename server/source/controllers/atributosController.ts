import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class AtributoController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todos los atributos
      const atributos = await this.prisma.atributo.findMany({});
      response.json(atributos);
    } catch (error) {
      next(error);
    }
  };
 
}
