import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/custom.error";
import { PrismaClient } from "../../generated/prisma";

export class PromocionController {
  prisma = new PrismaClient();

  get = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener todas las Promocions incluyendo el usuario, ordenadas por fecha
      // de forma ascendente, omitiendo el password del usuario
      const promociones = await this.prisma.promocion.findMany({
        include: {
          producto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          categoria: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
        orderBy: {
          fecha_inicio: "desc",
        },
      });
      response.json(promociones);
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
      let idPromocion = parseInt(request.params.id);
      const orden = await this.prisma.promocion.findUnique({
        where: { id: idPromocion },
        include: {
          producto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          categoria: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
      });
      response.json(orden);
    } catch (error: any) {
      next(error);
    }
  };
  //Obtener por Id todos los productos con promo
  getallProductswithPromo = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const idPromocion = parseInt(request.params.id);

      const promocion = await this.prisma.promocion.findUnique({
        where: { id: idPromocion },
        select: {
          referencia_id_producto: true,
          referencia_id_categoria: true,
          tipo: true,
          valor: true,
        },
      });

      if (!promocion) {
        throw AppError.notFound("Promoción no encontrada");
      }
      let nombreCategoria = null;

      if (promocion.referencia_id_categoria) {
        const categoria = await this.prisma.categoria.findUnique({
          where: { id: promocion.referencia_id_categoria },
          select: { nombre: true },
        });
        nombreCategoria = categoria?.nombre || null;
      }

      const productos: any[] = [];

      const calcularDescuento = (precio: number) => {
        let precio_con_descuento = precio;

        // Comparar ignorando mayúsculas/minúsculas
        const tipo = promocion.tipo.toLowerCase();

        if (tipo === "porcentaje") {
          precio_con_descuento = parseFloat(
            (precio * (1 - promocion.valor / 100)).toFixed(2)
          );
        } else if (tipo === "cantidadfija") {
          precio_con_descuento = parseFloat(
            (precio - promocion.valor).toFixed(2)
          );
        }

        precio_con_descuento = Math.max(0, precio_con_descuento);

        return {
          precio_con_descuento,
          monto_descuento: parseFloat(
            (precio - precio_con_descuento).toFixed(2)
          ),
        };
      };

      if (promocion.referencia_id_producto) {
        const producto = await this.prisma.producto.findUnique({
          where: { id: promocion.referencia_id_producto },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio_base: true,
            imagenes: {
              select: {
                url: true,
              },
            },
          },
        });

        if (producto) {
          const { precio_con_descuento, monto_descuento } = calcularDescuento(
            producto.precio_base
          );
          productos.push({
            ...producto,
            tipo_promocion: promocion.tipo,
            valor_promocion: promocion.valor,
            precio_con_descuento,
            monto_descuento,
            esPorProducto: true,
            esPorCategoria: false,
            nombre_categoria: null,
          });
        }
      }

      if (promocion.referencia_id_categoria) {
        const productosCategoria = await this.prisma.producto.findMany({
          where: { categoria_id: promocion.referencia_id_categoria },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio_base: true,
            imagenes: {
              select: {
                url: true,
              },
            },
          },
        });

        for (const prod of productosCategoria) {
          const existente = productos.find((p) => p.id === prod.id);
          if (existente) {
            existente.esPorCategoria = true; // ya venía por producto, ahora también por categoría
            existente.nombre_categoria = nombreCategoria;
          } else {
            const { precio_con_descuento, monto_descuento } = calcularDescuento(
              prod.precio_base
            );
            productos.push({
              ...prod,
              tipo_promocion: promocion.tipo,
              valor_promocion: promocion.valor,
              precio_con_descuento,
              monto_descuento,
              esPorProducto: false,
              esPorCategoria: true,
              nombre_categoria: nombreCategoria,
            });
          }
        }
      }

      response.json(productos);
    } catch (error) {
      next(error);
    }
  };

  search = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener los valores del query string
      const { termino } = request.query;

      //const { categoria,etiquetas } =request.query;
      if (typeof termino !== "string" || termino.trim() === "") {
        next(AppError.badRequest("El término de búsqueda es requerido"));
      }
      const searchTerm: string = termino as string;
      const objVideojuego = await this.prisma.promocion.findMany({
        where: {
          nombre: {
            contains: searchTerm,
          },
        },
        include: {
          producto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          categoria: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
      });
      //Dar respuesta
      response.json(objVideojuego);
    } catch (error) {
      next(error);
    }
  };
  //Crear
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      //Obtener los datos json
      const body = request.body;

      const nuevaPromo = await this.prisma.promocion.create({
        data: {
          nombre: body.nombre,
          tipo: body.tipo,
          valor: body.valor,
          fecha_inicio: body.fecha_inicio,
          fecha_fin: body.fecha_fin,
          referencia_id_categoria: body.idCategoria,
          referencia_id_producto: body.idproducto,
        },
      });
      response.status(201).json(nuevaPromo);
    } catch (error) {
      next(error);
    }
  };
  //Actualizar
  //Actualizar un videojuego
  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const body = request.body;
      const idPromo = parseInt(request.params.id);

      //Obtener videojuego anterior
      const promoExistente = await this.prisma.promocion.findUnique({
        where: { id: idPromo },
        include: {
          producto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          categoria: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
      });
      if (!promoExistente) {
        response.status(404).json({ message: "La promoción no existe" });
        return;
      }
      //Actualizar
      const updatePromo = await this.prisma.promocion.update({
        where: {
          id: idPromo,
        },
        data: {
          nombre: body.nombre,
          tipo: body.tipo,
          valor: body.valor,
          fecha_inicio: body.fecha_inicio,
          fecha_fin: body.fecha_fin,
          referencia_id_categoria: body.idCategoria,
          referencia_id_producto: body.idproducto,
        },
      });

      response.json(updatePromo);
    } catch (error) {
      next(error);
    }
  };
}
