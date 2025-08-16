import { PrismaClient, Prisma } from "../../generated/prisma";
import { Request, Response, NextFunction } from "express";

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export class ReporteController {
  prisma = new PrismaClient();

  // 1. Ventas por día (filtrar por rango de fechas)
  getVentasPorDia = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const result = await this.prisma.$queryRaw(
        Prisma.sql`
        SELECT DATE(p.fecha_pedido) AS name, SUM(i.cantidad) AS value
FROM Pedido p
JOIN PedidoItem i ON p.id = i.pedido_id
WHERE p.fecha_pedido >= ${fechaInicio}
  AND p.fecha_pedido <= ${fechaFin}
GROUP BY DATE(p.fecha_pedido)
ORDER BY DATE(p.fecha_pedido);`
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // 2. Ventas por mes (usuario elige año o mes específico)
  getVentasPorMes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { anio, mes } = req.query;

      const result = await this.prisma.$queryRaw(
        Prisma.sql`
        SELECT DATE_FORMAT(p.fecha_pedido, '%Y-%m') AS name, SUM(i.cantidad) AS value
        FROM Pedido p
        JOIN PedidoItem i ON p.id = i.pedido_id
        WHERE (${anio} IS NULL OR YEAR(p.fecha_pedido) = ${anio})
          AND (${mes} IS NULL OR MONTH(p.fecha_pedido) = ${mes})
        GROUP BY DATE_FORMAT(p.fecha_pedido, '%Y-%m')
        ORDER BY name;`
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // 3. Pedidos por estado (usuario elige estado y opcionalmente año/mes)
  getPedidosPorEstado = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT t.estado AS name, COUNT(*) AS value
        FROM Pedido p
        JOIN TransicionEstadoPedido t ON t.pedido_id = p.id
        GROUP BY t.estado;
      `;
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // 4. Top 3 productos más vendidos (sin filtro, pero podrías filtrar por mes también)
  getTopProductos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT pr.nombre AS name, SUM(i.cantidad) AS value
        FROM PedidoItem i
        JOIN Producto pr ON i.producto_id = pr.id
        JOIN Pedido p ON i.pedido_id = p.id
        GROUP BY pr.nombre
        ORDER BY value DESC
        LIMIT 3;
      `;
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // 5. Últimas 3 reseñas
  getUltimasResenas = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.prisma.resena.findMany({
        take: 3,
        orderBy: { fecha: "desc" },
        include: {
          usuario: { select: { nombre_usuario: true } },
          producto: { select: { nombre: true } },
        },
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
