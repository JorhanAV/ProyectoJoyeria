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
    const body = request.body;

    // Convertir tipos
    const valor = Number(body.valor);
    const idCategoria = body.idCategoria ? Number(body.idCategoria) : null;
    const idProducto = body.idproducto ? Number(body.idproducto) : null;

    // Validar campos obligatorios
    if (!body.nombre || !body.tipo || isNaN(valor) || !body.fecha_inicio || !body.fecha_fin) {
      throw AppError.badRequest("Faltan campos obligatorios o hay datos inválidos.");
    }

    // Validar que al menos uno de los dos esté presente
    if (!idCategoria && !idProducto) {
      throw AppError.badRequest("Debe asociar la promoción a un producto o a una categoría.");
    }

    // Validar existencia de categoría si se proporciona
    if (idCategoria) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: idCategoria }
      });
      if (!categoria) throw AppError.notFound("Categoría no encontrada.");
    }

    // Validar existencia de producto si se proporciona
    if (idProducto) {
      const producto = await this.prisma.producto.findUnique({
        where: { id: idProducto }
      });
      if (!producto) throw AppError.notFound("Producto no encontrado.");
    }

    // Crear data de promoción
    const dataPromo: any = {
      nombre: body.nombre,
      tipo: body.tipo,
      valor: valor,
      fecha_inicio: new Date(body.fecha_inicio),
      fecha_fin: new Date(body.fecha_fin),
    };

    // Condicionalmente conectar categoría o producto
    if (idCategoria) {
      dataPromo.categoria = {
        connect: { id: idCategoria }
      };
    }

    if (idProducto) {
      dataPromo.producto = {
        connect: { id: idProducto }
      };
    }

    // Crear promoción
    const nuevaPromo = await this.prisma.promocion.create({
      data: dataPromo
    });

    response.status(201).json(nuevaPromo);
  } catch (error) {
    console.error("Error en create:", error);
    next(error);
  }
};

  //Actualizar
  //Actualizar un videojuego
  update = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const idPromo = parseInt(request.params.id);
    const body = request.body;

    // Convertir valores
    const valor = Number(body.valor);
    const idCategoria = body.idCategoria ? Number(body.idCategoria) : null;
    const idProducto = body.idproducto ? Number(body.idproducto) : null;

    // Validaciones iniciales
    if (!body.nombre || !body.tipo || isNaN(valor) || !body.fecha_inicio || !body.fecha_fin) {
      throw AppError.badRequest("Faltan campos obligatorios o hay datos inválidos.");
    }

    if (!idCategoria && !idProducto) {
      throw AppError.badRequest("Debe asociar la promoción a un producto o a una categoría.");
    }

    // Validar existencia de la promoción
    const promoExistente = await this.prisma.promocion.findUnique({
      where: { id: idPromo }
    });

    if (!promoExistente) {
      throw AppError.notFound("La promoción no existe.");
    }

    // Validar existencia de la categoría si se proporciona
    if (idCategoria) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: idCategoria }
      });
      if (!categoria) {
        throw AppError.notFound("Categoría no encontrada.");
      }
    }

    // Validar existencia del producto si se proporciona
    if (idProducto) {
      const producto = await this.prisma.producto.findUnique({
        where: { id: idProducto }
      });
      if (!producto) {
        throw AppError.notFound("Producto no encontrado.");
      }
    }

    // Preparar data para actualización
    const dataPromo: any = {
      nombre: body.nombre,
      tipo: body.tipo,
      valor: valor,
      fecha_inicio: new Date(body.fecha_inicio),
      fecha_fin: new Date(body.fecha_fin),
      referencia_id_categoria: idCategoria,
      referencia_id_producto: idProducto,
    };

    // Actualizar promoción
    const updatePromo = await this.prisma.promocion.update({
      where: { id: idPromo },
      data: dataPromo,
    });

    response.json(updatePromo);
  } catch (error) {
    console.error("Error en update:", error);
    next(error);
  }
};

}
