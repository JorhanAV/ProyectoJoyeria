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
          nombre: true,
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
      const { nombre } = request.body;

      const etiqueta = await this.prisma.etiqueta.create({
        data: {
          nombre,
          productos: {
            create: request.body.productosIds.map((item: { id: number }) => ({
              producto: { connect: { id: item.id } },
            })),
          },
        }
      });

     response.json(etiqueta);
    } catch (error) {
      console.error(error);
       next(error);
    }
  }

  // Actualizar etiqueta y sus productos
  update = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const idEtiqueta = parseInt(request.params.id);
    const { nombre, productosIds } = request.body;

    // Mapear [{id:1}, {id:3}] a [1,3]
    const productoIds = productosIds ? productosIds.map((p: { id: number }) => p.id) : [];

    const createProductos = productoIds.map((productoId: number) => ({
      producto: { connect: { id: productoId } }
    }));

    const etiqueta = await this.prisma.etiqueta.update({
      where: { id: idEtiqueta },
      data: {
        nombre,
        productos: {
          deleteMany: {}, // elimina todas las relaciones existentes
          create: createProductos, // crea las nuevas
        },
      },
      include: { productos: true },
    });

    response.json(etiqueta);
  } catch (error) {
    console.error(error);
    next(error);
  }
};


}
