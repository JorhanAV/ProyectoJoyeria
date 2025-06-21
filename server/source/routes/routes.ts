import { Router } from "express";
import { ResenaRoutes } from "./resena.routes";
import { PromocionRoutes } from "./promociones.routes";
export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // ----Agregar las rutas----

    // localhost:3000/resena/
    router.use("/resena", ResenaRoutes.routes);
    
    // localhost:3000/promocion/
    router.use("/promocion", PromocionRoutes.routes);

    return router;
  }
}
