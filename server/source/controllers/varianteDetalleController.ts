import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";

export class VarianteDetalleController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todos los detalles de variantes
      const detalles = await this.prisma.varianteDetalle.findMany({});
      response.json(detalles);
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id_productoPersonalizable, id_valores } = request.body;

      const nuevoDetalle = await this.prisma.$transaction(
        id_valores.map((id_valor: number) =>
          this.prisma.varianteDetalle.create({
            data: {
              productoPersonalizable: {
                connect: { id: id_productoPersonalizable },
              },
              valor: {
                connect: { id: id_valor },
              },
            },
          })
        )
      );

      const detalles = await this.prisma.varianteDetalle.findMany({
        where: {
          id_productoPersonalizable: id_productoPersonalizable,
        },
        include: {
          valor: {
            include: {
              atributo: true,
            },
          },
        },
      });

      const criterios = detalles.map((detalle) => ({
        criterio: detalle.valor.atributo.nombre,
        seleccion: detalle.valor.valor,
        precio_extra: detalle.valor.precio_extra,
      }));

      response.status(201).json(criterios);
    } catch (error) {
      next(error);
    }
  };
}
