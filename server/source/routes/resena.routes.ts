import { Router } from 'express'  
import { ResenaController } from '../controllers/resenaController'
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware'
import { Rol } from '../../generated/prisma'
export class ResenaRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new ResenaController() 
        //localhost:3000/orden/ 
        router.get('/',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.get) 
        //localhost:3000/orden/6
        router.get('/:id',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.getById) 

        //Crear
        router.post('/',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN, Rol.CLIENTE),
            controller.create)

        return router 
    } 
}