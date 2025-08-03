import { Router } from 'express'  
import { productoPersonalizableController } from '../controllers/productoPersonalizado'

export class ProductoPersonalizableRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new productoPersonalizableController() 
        //localhost:3000/varianteDetalle/ 
        router.get('/',controller.get) 
        //localhost:3000/varianteDetalle/6
        //router.get('/:id',controller.getById)        
        
        //Crear
        router.post('/',controller.create)
        return router 
    } 
}