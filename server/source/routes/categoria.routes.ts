import { Router } from 'express'  
import { CategoriaController } from '../controllers/categoriaController'

export class CategoriaRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new CategoriaController() 
        //localhost:3000/categoria/ 
        router.get('/',controller.get) 
        //localhost:3000/categoria/6
        router.get('/:id',controller.getById) 

        //Crear
        router.post('/',controller.create)
        
        return router 
    } 
}