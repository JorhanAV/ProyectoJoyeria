import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ResenaService } from '../../share/services/resena.service';

@Component({
  selector: 'app-resena-detail',
  standalone: false,
  templateUrl: './resena-detail.html',
  styleUrl: './resena-detail.css',
})
export class ResenaDetail {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  stars = Array(5);
  
  constructor(
    private ResenaService: ResenaService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    let id = this.activeRoute.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.obtenerResena(Number(id));
  }

  obtenerResena(id: number) {
    this.ResenaService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }
  goback() {
    this.router.navigate(['/resena']);
  }

  ngOnDestroy() {
    this.destroy$.next(true); // Emite un valor para notificar a 'takeUntil'
    this.destroy$.unsubscribe(); // Completa el Subject 'destroy$' para liberar recursos
  }
}
