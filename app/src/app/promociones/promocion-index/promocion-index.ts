import { Component } from '@angular/core';
import { PromocionService } from '../../share/services/promocion.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { PromocionModel } from '../../share/models/PromocionModel';

@Component({
  selector: 'app-promocion-index',
  standalone: false,
  templateUrl: './promocion-index.html',
  styleUrl: './promocion-index.css',
})
export class PromocionIndex {
  //Respuesta del API
  datos: any;

  constructor(
    private promocionService: PromocionService,
    private noti: NotificationService,
    private router: Router
  ) {
    this.listPromos();
  }

  //Listar todos los resenas del API
listPromos() {
  this.promocionService.get().subscribe((respuesta: PromocionModel[]) => {
    console.log(respuesta);

    // Agregar banderas a cada promo según venga producto/categoría
    this.datos = respuesta.map((promo) => {
      return {
        ...promo,
        esPorProducto: promo.producto !== null,
        esPorCategoria: promo.categoria !== null
      };
    });
  });
}
  detalle(id: Number) {
    this.router.navigate(['/promocion', id]);
  }
  calcularDescuento(promo: PromocionModel): number {
    const precioBase = promo.producto?.precio_base || 0;

    if (promo.tipo === 'Porcentaje') {
      return Math.round(precioBase * (1 - promo.valor / 100));
    } else {
      return Math.max(0, precioBase - promo.valor);
    }
  }
  getEstadoTexto(promo: PromocionModel): string {
  const hoy = new Date();
  const inicio = new Date(promo.fecha_inicio);
  const fin = new Date(promo.fecha_fin);

  if (hoy >= inicio && hoy <= fin) {
    return 'Vigente';
  } else if (hoy < inicio) {
    return 'Pendiente';
  } else {
    return 'Aplicado';
  }
}
 getEstadoColor(promo: PromocionModel): string {
    const hoy = new Date();
    const inicio = new Date(promo.fecha_inicio);
    const fin = new Date(promo.fecha_fin);

    if (hoy >= inicio && hoy <= fin) {
      return '#0a9b07'; // Vigente
    } else if (hoy < inicio) {
      return '#6f6f6f'; // Pendiente
    } else {
      return '#dc0404'; // Aplicado
    }
  }
  getEstadoClase(promo: PromocionModel): string {
  const estado = this.getEstadoTexto(promo);
  if (estado === 'Pendiente') return 'promo-card promo-pendiente';
  if (estado === 'Aplicado') return 'promo-card promo-aplicado';
  return 'promo-card promo-vigente';
}
volverInicio() {
  this.router.navigate(['/']); // o a la ruta principal que uses
}

}
