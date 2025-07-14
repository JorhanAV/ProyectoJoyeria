import { Router } from 'express'  
import { ResenaController } from '../controllers/resenaController'
export class ResenaRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new ResenaController() 
        //localhost:3000/orden/ 
        router.get('/',controller.get) 
        //localhost:3000/orden/6
        router.get('/:id',controller.getById) 

        //Crear
        router.post('/',controller.create)
        
        return router 
    } 
}