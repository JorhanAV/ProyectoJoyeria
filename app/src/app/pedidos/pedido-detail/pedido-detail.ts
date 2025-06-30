import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PedidoService } from '../../share/services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pedido-detail',
  standalone: false,
  templateUrl: './pedido-detail.html',
  styleUrl: './pedido-detail.css'
})
export class PedidoDetail {
  pedido: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  stars = Array(5);
  
  constructor(
    private PedidoService: PedidoService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    let id = this.activeRoute.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.obtenerPedido(Number(id));
  }

  obtenerPedido(id: number) {
    this.PedidoService.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.pedido = data;
      });
  }
  goback() {
    this.router.navigate(['/pedidos']);
  }

  ngOnDestroy() {
    this.destroy$.next(true); // Emite un valor para notificar a 'takeUntil'
    this.destroy$.unsubscribe(); // Completa el Subject 'destroy$' para liberar recursos
  }
}