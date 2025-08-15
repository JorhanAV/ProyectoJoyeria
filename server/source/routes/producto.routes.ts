import { Router } from 'express'  
import { ProductoController } from '../controllers/productoController'
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware'
import { Rol } from '../../generated/prisma'
import { authenticate } from 'passport'
export class ProductoRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new ProductoController() 
        //localhost:3000/producto/ 
        router.get('/',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.get) 
        //localhost:3000/producto/6
        router.get('/:id',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.getById)  
        
        //Crear
        router.post('/',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN),
            controller.create)

        //Actualizar
        router.put('/:id',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN),
            controller.update)

        return router 
    } 
}