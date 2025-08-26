import { Component } from '@angular/core';
import { PedidoService } from '../../share/services/pedido.service';
import { NotificationService } from '../../share/notification-service';
import { NavigationEnd, Router } from '@angular/router';
import { PedidoModel } from '../../share/models/PedidoModel';
import { EstadoPedidoModel } from '../../share/models/EstadoPedidoModel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pedido-index',
  standalone: false,
  templateUrl: './pedido-index.html',
  styleUrl: './pedido-index.css',
})
export class PedidoIndex {
  datos: any;
 private routerSub!: Subscription;
  constructor(
    private pedidoService: PedidoService,
    private noti: NotificationService,
    private router: Router
  ) {
    this.listPedidos();
  }
 ngOnInit() {
  this.listPedidos();

  this.pedidoService.refreshPedidos$.subscribe(() => {
    this.listPedidos();
  });
}


  //Listar todos los productos del API
  listPedidos() {
    this.pedidoService.get().subscribe((respuesta: PedidoModel[]) => {
      console.log(respuesta);
      this.datos = respuesta;
    });
  }
  columnas: string[] = ['id', 'usuario', 'fecha_pedido', 'estado', 'accion'];
  getIconoEstado(estado: string): string {
    const normalizado = estado?.toUpperCase().replace(/\s|-/g, '');
    switch (normalizado) {
      case 'PENDIENTEDEPAGO':
        return 'hourglass_empty';
      case 'PAGADO':
        return 'check_circle';
      case 'ENPREPARACION':
        return 'local_shipping';
      case 'ENTREGADO':
        return 'check';
      default:
        return 'help_outline';
    }
  }

  getIconoEstadoClase(estado: string): string {
    const normalizado = estado?.toUpperCase().replace(/\s|-/g, '');
    switch (normalizado) {
      case 'PENDIENTEDEPAGO':
        return 'estado-pendiente';
      case 'PAGADO':
        return 'estado-pagado';
      case 'ENPREPARACION':
        return 'estado-preparacion';
      case 'ENTREGADO':
        return 'estado-entregado';
      default:
        return '';
    }
  }
  detalle(id: Number) {
    this.router.navigate(['/pedido', id]);
  }
}
