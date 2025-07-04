import { Component } from '@angular/core';
import { ResenaService } from '../../share/services/resena.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { ResenaModel } from '../../share/models/ResenaModel';

@Component({
  selector: 'app-resena-index',
  standalone: false,
  templateUrl: './resena-index.html',
  styleUrl: './resena-index.css'
})
export class ResenaIndex {
  //Respuesta del API
  datos: any;

  constructor(private resenaService:ResenaService,
    private noti:NotificationService,
    private router:Router
  ) {   
    this.listResenas()
  }

  //Listar todos los resenas del API
  listResenas() {
    //localhost:3000/resena
    this.resenaService.get().subscribe((respuesta: ResenaModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
      
    });
  }
  detalle(id:Number){
    this.router.navigate(['/resena',id])
  }
 

}
