import { Router } from 'express';
import { PedidoController } from '../controllers/pedidoController';

export class PedidoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PedidoController();

    router.get('/', controller.get);
    router.get('/:id', controller.getById);

    return router;
  }
}
