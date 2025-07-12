import { Router } from "express";
import { ResenaRoutes } from "./resena.routes";

import { PromocionRoutes } from "./promociones.routes";
import { PedidoRoutes } from "./pedidos.routes";

import { ProductoRoutes } from "./producto.routes";
import { UsuarioRoutes } from "./usuario.routes";
import { EtiquetaRoutes } from "./etiqueta.routes";
import { CategoriaRoutes } from "./categoria.routes";
import { ImageRoutes } from "./images.routes";

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

    // localhost:3000/usuario/
    router.use("/usuario", UsuarioRoutes.routes);

    // localhost:3000/etiqueta/
    router.use("/etiqueta", EtiquetaRoutes.routes);

    // localhost:3000/categoria/
    router.use("/categoria", CategoriaRoutes.routes);

    //localhost:3000/file/
    router.use("/file/", ImageRoutes.routes);

    return router;
  }
}
