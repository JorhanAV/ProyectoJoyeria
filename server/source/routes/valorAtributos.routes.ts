import { Router } from 'express'  
import { ValorAtributoController } from '../controllers/valorAtributoController'

export class ValorAtributosRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new ValorAtributoController() 
        //localhost:3000/atributos/ 
        router.get('/',controller.get) 
        //localhost:3000/atributos/6
        //router.get('/:id',controller.getById)         
        return router 
    } 
}