import { Router } from "express";
import { ResenaRoutes } from "./resena.routes";
export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // ----Agregar las rutas----

    // localhost:3000/resena/
    router.use("/resena", ResenaRoutes.routes);

    return router;
  }
}
