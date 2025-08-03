import { Router } from 'express'  
import { VarianteDetalleController } from '../controllers/varianteDetalleController'

export class VarianteDetalleRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new VarianteDetalleController() 
        //localhost:3000/varianteDetalle/ 
        router.get('/',controller.get) 
        //localhost:3000/varianteDetalle/6
        //router.get('/:id',controller.getById)        
        
        //Crear
        router.post('/',controller.create)
        return router 
    } 
}