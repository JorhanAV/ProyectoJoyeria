import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

export class EtiquetaController {
  prisma = new PrismaClient();

  // Obtener todas las etiquetas
  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const etiquetas = await this.prisma.etiqueta.findMany({
        orderBy: { nombre: "asc" },
      });
      response.json(etiquetas);
    } catch (error) {
      next(error);
    }
  };

  // Obtener etiqueta por ID
  getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const idEtiqueta = parseInt(request.params.id);
      const etiqueta = await this.prisma.etiqueta.findUnique({
        where: { id: idEtiqueta },
        select: {
          id: true,
          nombre: true,
          productos: {
            select: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  descripcion: true,
                  precio_base: true,
                },
              },
            },
          },
        },
      });

      response.json(etiqueta);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  // Crear etiqueta
  async create(req: Request, res: Response) {
    try {
      const { nombre, productosIds } = req.body;

      const nuevaEtiqueta = await this.prisma.etiqueta.create({
        data: {
          nombre,
          productos: productosIds
            ? {
                connect: productosIds.map((id: number) => ({ id })),
              }
            : undefined,
        },
        include: { productos: true },
      });
      res.json(nuevaEtiqueta);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear etiqueta" });
    }
  }

  // Actualizar etiqueta y sus productos
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, productosIds } = req.body;

      const etiquetaActualizada = await this.prisma.etiqueta.update({
        where: { id: Number(id) },
        data: {
          nombre,
          productos: productosIds
            ? {
                set: productosIds.map((id: number) => ({ id })), // 🔄 Reemplaza relaciones
              }
            : undefined,
        },
        include: { productos: true },
      });

      res.json(etiquetaActualizada);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar etiqueta" });
    }
  }

}
