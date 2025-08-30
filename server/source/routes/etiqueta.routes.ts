import { Router } from "express";
import { EtiquetaController } from "../controllers/etiquetaController";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware";
import { Rol } from "../../generated/prisma";

export class EtiquetaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new EtiquetaController();
    //localhost:3000/etiqueta/
    router.get("/", controller.get);
    //localhost:3000/etiqueta/6
    router.get(
      "/:id",
      controller.getById
    );
    //Crear
    router.post(
      "/",
      authenticateJWT,
      authorizeRoles(Rol.ADMIN),
      controller.create
    );
    router.put(
      "/:id",
      authenticateJWT,
      authorizeRoles(Rol.ADMIN),
      controller.update
    );
    return router;
  }
}
