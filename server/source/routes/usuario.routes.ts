import { Router } from 'express'  
import { UsuarioController } from '../controllers/usuarioController'
export class UsuarioRoutes { 
    static get routes(): Router { 
        const router= Router() 
        const controller=new UsuarioController() 
        //localhost:3000/usuario/ 
        router.get('/',controller.get) 
        //localhost:3000/usuario/6
        router.get('/:id',controller.getById) 

        //Crear
        router.post('/',controller.create)
        
        return router 
    } 
}