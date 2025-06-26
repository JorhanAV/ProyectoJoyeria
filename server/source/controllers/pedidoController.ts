import { RequestHandler } from "express";
import { PrismaClient } from "../../generated/prisma";

export class PedidoController {
  prisma = new PrismaClient();

  get: RequestHandler = async (req, res, next) => {
    try {
      const pedidos = await this.prisma.pedido.findMany({
        include: {
          items: {
            include: {
              producto: {
                select: {
                  nombre: true,
                  precio_base: true,
                },
              },
              producto_personalizado: {
                select: {
                  nombre: true,
                  producto_base: {
                    select: {
                      precio_base: true,
                    },
                  },
                },
              },
              variante_seleccionada: {
                include: {
                  detalles: {
                    include: {
                      atributo: true,
                      valor: true,
                    },
                  },
                },
              },
            },
          },
          usuario: {
            select: {
              nombre_usuario: true,
            },
          },
        },
        orderBy: {
          fecha_pedido: "desc",
        },
      });

      const pedidosFormateados = pedidos.map((ped) => {
        const productos = ped.items.map((item) => {
          const cantidad = item.cantidad;

          if (!item.producto_personalizado) {
            const precio_base = item.producto.precio_base;
            const subtotal = +(precio_base * cantidad).toFixed(2);

            return {
              tipo: "Producto estándar",
              nombre: item.producto.nombre,
              precio_unitario: precio_base,
              cantidad,
              subtotal,
            };
          }

          const precioBase =
            item.producto_personalizado.producto_base.precio_base;
          const nombre = item.producto_personalizado.nombre;

          let criterios = [];
          let totalOpciones = 0;

          for (const detalle of item.variante_seleccionada?.detalles || []) {
            criterios.push({
              criterio: detalle.atributo.nombre,
              seleccion: detalle.valor.valor,
              precio_extra: detalle.valor.precio_extra,
            });
            totalOpciones += detalle.valor.precio_extra;
          }

          const totalIndividual = +(precioBase + totalOpciones).toFixed(2);
          const subtotal = +(totalIndividual * cantidad).toFixed(2);

          return {
            tipo: "Producto personalizado",
            nombre,
            precio_base: precioBase,
            criterios,
            total_individual: totalIndividual,
            cantidad,
            subtotal,
          };
        });

        return { 
          pedidoId: ped.id,
          usuario: ped.usuario,
          direccion_envio: ped.direccion_envio,
          fecha_pedido: ped.fecha_pedido,
          productos,
          metodoPago: ped.metodo_pago,
          subtotal: ped.subtotal,
          impuestos: ped.impuestos,
          total: parseFloat(ped.total.toFixed(2)),
        };
      });

      res.json(pedidosFormateados);
    } catch (error) {
      next(error);
    }
  };

  getById: RequestHandler = async (req, res, next) => {
    try {
      const idpedido = parseInt(req.params.id);

      const pedido = await this.prisma.pedido.findUnique({
        where: { id: idpedido },
        include: {
          items: {
            include: {
              producto: {
                select: {
                  nombre: true,
                  descripcion: true,
                  precio_base: true,
                },
              },
              producto_personalizado: {
                select: {
                  nombre: true,
                  producto_base: {
                    select: {
                      precio_base: true,
                    },
                  },
                },
              },
              variante_seleccionada: {
                include: {
                  detalles: {
                    include: {
                      atributo: true,
                      valor: true,
                    },
                  },
                },
              },
            },
          },
          usuario: {
            select: {
              nombre_usuario: true,
            },
          },
        },
      });

      if (!pedido) {
        res.status(404).json({ mensaje: "Pedido no encontrado" });
        return;
      }

      const productos = pedido.items.map((item) => {
        const cantidad = item.cantidad;

        if (!item.producto_personalizado) {
          const { nombre, descripcion, precio_base } = item.producto;
          const subtotal = +(precio_base * cantidad).toFixed(2);
          return {
            tipo: "Producto estándar",
            nombre,
            descripcion,
            precio_unitario: precio_base,
            cantidad,
            subtotal,
          };
        }

        const precioBase =
          item.producto_personalizado.producto_base.precio_base;
        const nombre = item.producto_personalizado.nombre;

        let criterios = [];
        let totalOpciones = 0;

        for (const detalle of item.variante_seleccionada?.detalles || []) {
          criterios.push({
            criterio: detalle.atributo.nombre,
            seleccion: detalle.valor.valor,
            precio_extra: detalle.valor.precio_extra,
          });
          totalOpciones += detalle.valor.precio_extra;
        }

        const totalIndividual = +(precioBase + totalOpciones).toFixed(2);
        const subtotal = +(totalIndividual * cantidad).toFixed(2);

        return {
          tipo: "Producto personalizado",
          nombre,
          precio_base: precioBase,
          criterios,
          total_individual: totalIndividual,
          cantidad,
          subtotal,
        };
      });

      const pedidoFormateado = {
        id: pedido.id,
        direccion_envio: pedido.direccion_envio,
        fecha_pedido: pedido.fecha_pedido,
        usuario: pedido.usuario,
        productos,
        metodoPago: pedido.metodo_pago,
        subtotal: pedido.subtotal,
        impuestos: pedido.impuestos,
        total: parseFloat(pedido.total.toFixed(2)),
      };

      res.json(pedidoFormateado);
    } catch (error) {
      next(error);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      res.status(201).json({ mensaje: "Pedido creado (aún no implementado)" });
    } catch (error) {
      next(error);
    }
  };
}
