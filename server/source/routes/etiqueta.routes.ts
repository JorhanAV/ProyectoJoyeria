import { Router } from 'express'  
import { EtiquetaController } from '../controllers/etiquetaController'

export class EtiquetaRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new EtiquetaController() 
        //localhost:3000/etiqueta/ 
        router.get('/',controller.get) 
        //localhost:3000/etiqueta/6
        router.get('/:id',controller.getById) 

        //Crear
        router.post('/',controller.create)
        
        return router 
    } 
}