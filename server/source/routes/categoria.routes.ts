import { Router } from 'express'  
import { categoriaController } from '../controllers/categoriaController'
export class CategoriaRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new categoriaController() 
        //localhost:3000/categoria/ 
        router.get('/',controller.get) 
        
        return router 
    } 
}