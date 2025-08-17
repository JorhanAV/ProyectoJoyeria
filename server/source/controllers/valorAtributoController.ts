import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class ValorAtributoController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todos los atributos
      const atributos = await this.prisma.valorAtributo.findMany({
        include:{
          atributo:{
            select:{
              nombre: true,
            }
          }
        }
      });
      response.json(atributos);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;

      const nuevaResena = await this.prisma.valorAtributo.create({
        data: {
          valor: body.valor,
          precio_extra: body.precio_extra,
          imagen: body.imagen,
          atributo: {
            connect: {
              id: body.id_atributo, 
            },
          },
        },
      });

      response.status(201).json(nuevaResena);
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;
      const idValorAtributo = parseInt(request.params.id);

      const resena = await this.prisma.valorAtributo.update({
        where: { id: idValorAtributo },
        data: {
          precio_extra: body.precio_extra,
        },
      });

      response.json(resena);
    } catch (error) {
      next(error);
    }
  };

  //Actualizar
  updateTest = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;
      const idValorAtributo = parseInt(request.params.id);

      const resena = await this.prisma.valorAtributo.update({
        where: { id: idValorAtributo },
        data: {
          valor: body.valor,
          precio_extra: body.precio_extra,
          imagen: body.imagen,
          atributo: {
            connect: {
              id: body.id_atributo, 
            },
          },
        },
      });

      response.json(resena);
    } catch (error) {
      next(error);
    }
  };
 
}
