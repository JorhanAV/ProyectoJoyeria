import { Component } from '@angular/core';
import { ResenaService } from '../../share/services/resena.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../share/notification-service';
import { ResenaModel } from '../../share/models/ResenaModel';

@Component({
  selector: 'app-resena-index',
  standalone: false,
  templateUrl: './resena-index.html',
  styleUrl: './resena-index.css',
})
export class ResenaIndex {
  //Respuesta del APi
  datos: any;

  constructor(
    private resService: ResenaService,
    private noti: NotificationService,
    private router: Router
  ) {
    this.listResenas();
  }

  listResenas() {
    this.resService.get().subscribe((respuesta: ResenaModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
    });
  }
  detalle(id: number) {
    this.router.navigate(['/resena', id]);
  }
}
