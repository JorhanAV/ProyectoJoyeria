import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class ProductoController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      // 1. Obtener todos los productos con su categoría e imágenes
      const productos = await this.prisma.producto.findMany({
        include: {
          categoria: {
            select: {
              nombre: true,
              id: true,
            },
          },
          imagenes: {
            select: {
              url: true,
            },
          },
          // No incluyas promociones aquí directamente, las manejaremos aparte
        },
      });

      // 2. Obtener todas las promociones activas (del producto O de la categoría)
      const promocionesActivas = await this.prisma.promocion.findMany({
        where: {
          fecha_inicio: { lte: new Date() },
          fecha_fin: { gte: new Date() },
        },
      });

      // 3. Mapear las promociones a los productos
      const productosConPromociones = productos.map((producto) => {
        const promocionesAplicables = promocionesActivas.filter((promo) => {
          // Si la promoción es específica de un producto, que coincida con el ID del producto
          const isProductPromo = promo.referencia_id_producto === producto.id;
          // Si la promoción es específica de una categoría, que coincida con el ID de la categoría del producto
          const isCategoryPromo =
            promo.referencia_id_categoria === producto.categoria.id;

          // Una promoción aplica si es una promoción de producto O una promoción de categoría
          return isProductPromo || isCategoryPromo;
        });

        // Asegurarse de que no haya duplicados si una promoción pudiera aplicar por ambos (aunque tus datos no lo muestran así)
        // O si quieres priorizar, por ejemplo, promociones de producto sobre las de categoría:
        // const finalPromotions = isProductPromo ? [promo] : (isCategoryPromo ? [promo] : []);
        // Esto depende de tu lógica de negocio. Para simplemente incluirlas, el filter es suficiente.

        return {
          ...producto,
          promociones: promocionesAplicables.map((p) => ({
            // Selecciona solo los campos que necesitas para la respuesta necesaria
            nombre: p.nombre,
            tipo: p.tipo,
            valor: p.valor,
            fecha_inicio: p.fecha_inicio,
            fecha_fin: p.fecha_fin,
            referencia_id_producto: p.referencia_id_producto,
            referencia_id_categoria: p.referencia_id_categoria,
          })),
        };
      });

      response.json(productosConPromociones);
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
      let idProducto = parseInt(request.params.id);
      const producto = await this.prisma.producto.findUnique({
        where: { id: idProducto },
        include: {
          categoria: {
            select: {
              nombre: true,
            },
          },
          etiquetas: {
            select: {
              etiqueta: true,
            },
          },
          resenas: {
            include: {
              usuario: {
                omit: { contraseña: true },
              },
            },
          },
          imagenes: {
            select: {
              url: true,
            },
          },
        },
      });
      const hoy = new Date();
      const promocionesActivas = await this.prisma.promocion.findMany({
        where: {
          fecha_inicio: { lte: hoy },
          fecha_fin: { gte: hoy },
        },
      });

      // 3. Filtrar promociones que aplican al producto o a su categoría
      const promocionesAplicables = promocionesActivas.filter((promo) => {
        const esPromoProducto = promo.referencia_id_producto === producto?.id;
        const esPromoCategoria =
          promo.referencia_id_categoria === producto?.categoria_id;
        return esPromoProducto || esPromoCategoria;
      });

      // 4. Agregar las promociones al producto
      const productoConPromociones = producto as any; // Usamos 'as any' para evitar problemas de tipos
      productoConPromociones.promociones = promocionesAplicables.map((p) => ({
        nombre: p.nombre,
        tipo: p.tipo,
        valor: p.valor,
        fecha_inicio: p.fecha_inicio,
        fecha_fin: p.fecha_fin,
        referencia_id_producto: p.referencia_id_producto,
        referencia_id_categoria: p.referencia_id_categoria,
      }));

      response.json(productoConPromociones);
    } catch (error: any) {
      next(error);
    }
  };
  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;

      const nuevoProducto = await this.prisma.producto.create({
        data: {
          nombre: body.nombre,
          descripcion: body.descripcion,
          precio_base: parseFloat(body.precio),
          stock: parseInt(body.stock),
          activo: body.activo,
          categoria: {
            connect: {
              id: body.categoria_id,
            },
          },
          etiquetas: {
            create: body.etiquetas_ids.map((id: number) => ({
              etiqueta: { connect: { id } },
            })),
          },
          imagenes: {
            create: (body.imagenes?.length
              ? body.imagenes
              : ["image-not-found.jpg"]
            ).map((url: string) => ({ url })),
          },
        },
      });

      response.status(201).json(nuevoProducto);
    } catch (error) {
      next(error);
    }
  };
}
