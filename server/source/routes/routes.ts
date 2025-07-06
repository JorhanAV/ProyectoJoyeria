import { Router } from "express";
import { ResenaRoutes } from "./resena.routes";

import { PromocionRoutes } from "./promociones.routes";
import { PedidoRoutes } from "./pedidos.routes";

import { ProductoRoutes } from "./producto.routes";
import { UsuarioRoutes } from "./usuario.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // ----Agregar las rutas----

    // localhost:3000/resena/
    router.use("/resena", ResenaRoutes.routes);

    
    // localhost:3000/promocion/
    router.use("/promocion", PromocionRoutes.routes);

    
    // localhost:3000/pedido/
    router.use("/pedido", PedidoRoutes.routes);

    // localhost:3000/producto/
    router.use("/producto", ProductoRoutes.routes);

    router.use("/usuario", UsuarioRoutes.routes); 

    return router;
  }
}
