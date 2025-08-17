import { Router } from 'express'  
import { ValorAtributoController } from '../controllers/valorAtributoController'
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware'
import { Rol } from '../../generated/prisma'

export class ValorAtributosRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new ValorAtributoController() 
        //localhost:3000/atributos/ 
        router.get('/',controller.get) 
        //localhost:3000/atributos/6
        //router.get('/:id',controller.getById)         

        router.put('/:id',
            authenticateJWT,
            authorizeRoles(Rol.ADMIN),
            controller.update)
        return router 
    } 
}