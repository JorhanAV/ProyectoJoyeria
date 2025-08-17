import { Router } from 'express';
import { PedidoController } from '../controllers/pedidoController';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { Rol } from '../../generated/prisma';

export class PedidoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PedidoController();

    router.get('/', 
      authenticateJWT,
      authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
      controller.get);
      
    router.get('/:id', 
      authenticateJWT,
      authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
      controller.getById);

    router.get('/usuario/:id', 
      authenticateJWT,
      authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
      controller.getByProductId);

    router.post('/', 
      authenticateJWT,
      authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
      controller.create);


    return router;
  }
}
