import { RequestHandler } from "express";
import { EstadoPedido, PrismaClient } from "../../generated/prisma";

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
                  variantes: {
                    include: {
                      valor: {
                        include: {
                          atributo: true,
                        },
                      },
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
          transiciones: {
            select: {
              estado: true,
              fecha_hora: true,
            },
            orderBy: {
              fecha_hora: "asc",
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

          if (!item.producto_personalizado && item.producto) {
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

          if (
            item.producto_personalizado &&
            item.producto_personalizado.producto_base
          ) {
            const precioBase =
              item.producto_personalizado.producto_base.precio_base;
            const nombre = item.producto_personalizado.nombre;

            const criterios = item.producto_personalizado.variantes.map(
              (variante) => ({
                criterio: variante.valor.atributo.nombre,
                seleccion: variante.valor.valor,
                precio_extra: variante.valor.precio_extra,
              })
            );

            const totalOpciones = criterios.reduce(
              (acc, curr) => acc + curr.precio_extra,
              0
            );
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
          }
        });

        const ultimoEstado = ped.transiciones.length
          ? ped.transiciones[ped.transiciones.length - 1].estado
          : "Pendiente";

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
          estado: ultimoEstado,
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
                  variantes: {
                    include: {
                      valor: {
                        include: {
                          atributo: true,
                        },
                      },
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
          transiciones: {
            select: {
              estado: true,
              fecha_hora: true,
            },
            orderBy: {
              fecha_hora: "asc",
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

        if (!item.producto_personalizado && item.producto) {
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

        if (
          item.producto_personalizado &&
          item.producto_personalizado.producto_base
        ) {
          const precioBase =
            item.producto_personalizado.producto_base.precio_base;
          const nombre = item.producto_personalizado.nombre;

          const criterios = item.producto_personalizado.variantes.map(
            (variante) => ({
              criterio: variante.valor.atributo.nombre,
              seleccion: variante.valor.valor,
              precio_extra: variante.valor.precio_extra,
            })
          );

          const totalOpciones = criterios.reduce(
            (acc, curr) => acc + curr.precio_extra,
            0
          );
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
        }
      });

      const ultimoEstado = pedido.transiciones.length
        ? pedido.transiciones[pedido.transiciones.length - 1].estado
        : "Pendiente";

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
        estado: ultimoEstado,
      };

      res.json(pedidoFormateado);
    } catch (error) {
      next(error);
    }
  };

  getByProductId: RequestHandler = async (req, res, next) => {
    try {
      const productoIdBuscado = parseInt(req.params.id);
      const pedidosConProducto = await this.prisma.pedidoItem.findMany({
        where: {
          producto_id: productoIdBuscado,
          pedido: {
            estado_carrito: false,
          },
        },
        select: {
          pedido: {
            select: {
              usuario_id: true,
            },
          },
        },
      });

      const usuarios = pedidosConProducto.map((item) => item.pedido.usuario_id);

      res.json(usuarios);
    } catch (error) {
      next(error);
    }
  };

 create: RequestHandler = async (req, res, next) => {
  try {
    const { usuario_id, direccion_envio, metodo_pago, items } = req.body;

    if (!usuario_id || !direccion_envio || !metodo_pago || !items?.length) {
      res.status(400).json({ mensaje: "Faltan campos obligatorios" });
      return;
    }

    let subtotal = 0;

    const itemsPreparados = await Promise.all(
      items.map(async (item: any) => {
        const cantidad = item.cantidad;

        if (item.producto_id) {
          const producto = await this.prisma.producto.findUnique({
            where: { id: item.producto_id },
            select: { precio_base: true, stock: true },
          });

          if (!producto) throw new Error("Producto estándar no encontrado");
          if (producto.stock < cantidad) {
            throw new Error(
              `Stock insuficiente para el producto con ID ${item.producto_id}`
            );
          }

          subtotal += producto.precio_base * cantidad;

          return {
            cantidad,
            producto: { connect: { id: item.producto_id } },
          };
        }

        if (item.producto_personalizado_id) {
          const personalizado =
            await this.prisma.productoPersonalizable.findUnique({
              where: { id: item.producto_personalizado_id },
              include: {
                producto_base: true,
                variantes: { include: { valor: true } },
              },
            });

          if (!personalizado)
            throw new Error("Producto personalizado no encontrado");

          const precioBase = personalizado.producto_base.precio_base;
          const extra = personalizado.variantes.reduce(
            (acc, v) => acc + v.valor.precio_extra,
            0
          );
          subtotal += (precioBase + extra) * cantidad;

          return {
            cantidad,
            producto_personalizado: {
              connect: { id: item.producto_personalizado_id },
            },
          };
        }

        throw new Error("Debe incluir producto_id o producto_personalizado_id");
      })
    );

    const impuestos = +(subtotal * 0.13).toFixed(2); // 13% IVA
    const total = +(subtotal + impuestos).toFixed(2);

    // 1️⃣ Buscar carrito activo
    const carritoActivo = await this.prisma.pedido.findFirst({
      where: { usuario_id, estado_carrito: true },
    });

    let pedidoFinal: any;

    if (carritoActivo) {
      // 2️⃣ Actualizar carrito existente → convertir en pedido
      pedidoFinal = await this.prisma.pedido.update({
        where: { id: carritoActivo.id },
        data: {
          direccion_envio,
          metodo_pago,
          subtotal,
          impuestos,
          total,
          fecha_pedido: new Date(),
          estado_carrito: false,
          items: {
            deleteMany: {}, // limpiamos lo que tenía
            create: itemsPreparados,
          },
          transiciones: {
            create: {
              estado: "PendienteDePago",
              fecha_hora: new Date(),
              admin: { connect: { id: 1 } }, // ← ⚠️ temporal
            },
          },
        },
        include: { items: true, transiciones: true },
      });
    } else {
      // 3️⃣ Crear pedido nuevo (tu código original)
      pedidoFinal = await this.prisma.pedido.create({
        data: {
          usuario: { connect: { id: usuario_id } },
          direccion_envio,
          metodo_pago,
          subtotal,
          impuestos,
          total,
          fecha_pedido: new Date(),
          items: { create: itemsPreparados },
          estado_carrito: false,
          transiciones: {
            create: {
              estado: "PendienteDePago",
              fecha_hora: new Date(),
              admin: { connect: { id: 1 } }, // ← ⚠️ temporal
            },
          },
        },
        include: { items: true, transiciones: true },
      });
    }

    // 💡 Descontar stock SOLO de productos estándar
    await Promise.all(
      items.map(async (item: any) => {
        if (item.producto_id) {
          await this.prisma.producto.update({
            where: { id: item.producto_id },
            data: {
              stock: { decrement: item.cantidad },
            },
          });
        }
      })
    );

    res.status(201).json(pedidoFinal);
  } catch (error: any) {
    next(error);
  }
};


  addBitacora: RequestHandler = async (req, res, next) => {
    try {
      const pedido_id = parseInt(req.params.id);
      const { estado, admin_id } = req.body;
      if (!pedido_id || !estado || !admin_id) {
        res.status(400).json({ mensaje: "Faltan campos obligatorios" });
        return;
      }
      const estadoRaw = req.body.estado;

      if (!Object.values(EstadoPedido).includes(estadoRaw)) {
        res.status(400).json({ mensaje: "Estado inválido" });
        return;
      }

      const estado2 = estadoRaw as EstadoPedido;

      const nuevaTransicion = await this.prisma.transicionEstadoPedido.create({
        data: {
          pedido: { connect: { id: pedido_id } },
          estado,
          fecha_hora: new Date(),
          admin: { connect: { id: admin_id } },
        },
      });

      res.status(201).json(nuevaTransicion);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ mensaje: error.message || "Error al agregar a la bitácora" });
    }
  };

  guardarCarrito: RequestHandler = async (req, res, next) => {
    try {
      const { usuario_id, direccion_envio, metodo_pago, items } = req.body;

      if (!usuario_id || !metodo_pago || !items?.length) {
        res.status(400).json({ mensaje: "Faltan campos obligatorios" });
        return;
      }

      const userId = Number(usuario_id);

      // Recalcular totales con datos actuales
      let subtotal = 0;

      const itemsPreparados = await Promise.all(
        items.map(async (item: any) => {
          const cantidad = item.cantidad;

          if (item.producto_id) {
            const producto = await this.prisma.producto.findUnique({
              where: { id: item.producto_id },
              select: { precio_base: true },
            });
            if (!producto) throw new Error("Producto estándar no encontrado");

            subtotal += producto.precio_base * cantidad;

            return {
              cantidad,
              producto: { connect: { id: item.producto_id } },
            };
          }

          if (item.producto_personalizado_id) {
            const personalizado =
              await this.prisma.productoPersonalizable.findUnique({
                where: { id: item.producto_personalizado_id },
                include: {
                  producto_base: true,
                  variantes: { include: { valor: true } },
                },
              });
            if (!personalizado)
              throw new Error("Producto personalizado no encontrado");

            const precioBase = personalizado.producto_base.precio_base;
            const extra = personalizado.variantes.reduce(
              (acc, v) => acc + v.valor.precio_extra,
              0
            );
            const totalIndividual = precioBase + extra;

            subtotal += totalIndividual * cantidad;

            return {
              cantidad,
              producto_personalizado: {
                connect: { id: item.producto_personalizado_id },
              },
            };
          }

          throw new Error(
            "Debe incluir producto_id o producto_personalizado_id"
          );
        })
      );

      const impuestos = +(subtotal * 0.13).toFixed(2);
      const total = +(subtotal + impuestos).toFixed(2);

      // Buscar carrito activo
      const existente = await this.prisma.pedido.findFirst({
        where: { usuario_id: userId, estado_carrito: true },
        include: { items: true },
      });

      let pedidoActualizado;

      if (existente) {
        // Actualizar carrito existente (limpiar items y recrearlos)
        pedidoActualizado = await this.prisma.$transaction(async (tx) => {
          await tx.pedidoItem.deleteMany({
            where: { pedido_id: existente.id },
          });

          return tx.pedido.update({
            where: { id: existente.id },
            data: {
              direccion_envio: direccion_envio ?? existente.direccion_envio,
              metodo_pago,
              subtotal,
              impuestos,
              total,
              items: {
                create: itemsPreparados,
              },
              // se mantiene estado_carrito: true
            },
            include: {
              items: true,
            },
          });
        });
      } else {
        // Crear carrito nuevo
        pedidoActualizado = await this.prisma.pedido.create({
          data: {
            usuario: { connect: { id: userId } },
            direccion_envio: direccion_envio ?? "",
            metodo_pago,
            subtotal,
            impuestos,
            total,
            fecha_pedido: new Date(),
            items: {
              create: itemsPreparados,
            },
            estado_carrito: true,
          },
          include: {
            items: true,
          },
        });
      }

      res.status(existente ? 200 : 201).json(pedidoActualizado);
    } catch (error: any) {
      next(error); // deja que ErrorMiddleware responda
    }
  };

  getCarritoActivo: RequestHandler = async (req, res, next) => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);

      const carrito = await this.prisma.pedido.findFirst({
        where: { usuario_id: usuarioId, estado_carrito: true },
        include: {
          items: {
            include: {
              producto: true,
              producto_personalizado: true,
            },
          },
        },
      });
      if (!carrito) {
        res.json(null);
        return;
      }

      res.json(carrito);
    } catch (error) {
      next(error);
    }
  };
}
