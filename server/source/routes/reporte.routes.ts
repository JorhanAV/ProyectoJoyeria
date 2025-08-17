import { Router } from "express";
import { ReporteController } from "../controllers/reporteController";

export class ReporteRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ReporteController();

// Ventas por día
router.get("/ventas-dia", controller.getVentasPorDia);

// Ventas por mes
router.get("/ventas-mes", controller.getVentasPorMes);

// Pedidos por estado
router.get("/pedidos-estado", controller.getPedidosPorEstado);

// Top 3 productos más vendidos
router.get("/top-productos", controller.getTopProductos);

// Últimas 3 reseñas
router.get("/ultimas-resenas", controller.getUltimasResenas);

    return router;
  }
}
