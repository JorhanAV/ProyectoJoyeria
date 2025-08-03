import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class ValorAtributoController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todos los atributos
      const atributos = await this.prisma.valorAtributo.findMany({});
      response.json(atributos);
    } catch (error) {
      next(error);
    }
  };
 
}
