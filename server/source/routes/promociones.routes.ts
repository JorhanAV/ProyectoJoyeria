import { Router } from 'express'  
import { PromocionController } from '../controllers/promocionController'
export class PromocionRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new PromocionController() 
        
        //localhost:3000/promocion/getallProductswithPromo/6
        router.get('/getallProductswithPromo/:id',controller.getallProductswithPromo)  
        //localhost:3000/promocion/ 
        router.get('/',controller.get) 
        //localhost:3000/promocion/6
        router.get('/:id',controller.getById)  
        return router 
    } 
}