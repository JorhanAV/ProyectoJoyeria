import { Router } from 'express'  
import { AtributoController } from '../controllers/atributosController'

export class AtributosRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new AtributoController() 
        //localhost:3000/atributos/ 
        router.get('/',controller.get) 
        //localhost:3000/atributos/6
        //router.get('/:id',controller.getById)         
        return router 
    } 
}