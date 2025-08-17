import { Router } from 'express'  
import { PromocionController } from '../controllers/promocionController'
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware'
import { Rol } from '../../generated/prisma'
export class PromocionRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new PromocionController() 
        
        //localhost:3000/promocion/getallProductswithPromo/6
        router.get('/getallProductswithPromo/:id',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.getallProductswithPromo)  
        //localhost:3000/promocion/ 
        router.get('/',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.get) 
        //localhost:3000/promocion/6
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