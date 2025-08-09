import { Component } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { ProductoService } from '../../share/services/producto.service';
import { Router } from '@angular/router';
import { ProductoModel } from '../../share/models/ProductoModel';
import { MatDialog } from '@angular/material/dialog';
import { ProductoPersonalizable } from '../producto-personalizable/producto-personalizable';


@Component({
  selector: 'app-producto-index',
  standalone: false,
  templateUrl: './producto-index.html',
  styleUrl: './producto-index.css',
})
export class ProductoIndex {
  datos: any;

  constructor(
    private prodService: ProductoService,
    private noti: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.listProductos();
  }

  //Listar todos los productos del API
  listProductos() {
    this.prodService.get().subscribe((respuesta: ProductoModel[]) => {
      const hoy = new Date();
      console.log(respuesta);
      this.datos = respuesta.map((producto) => {
        // Establece la imagen por defecto
        producto.imagenActual = producto.imagenes[0]?.url;

        // Encuentra promociones vigentes
        const promocionesVigentes = producto.promociones.filter((promo) => {
          const inicio = new Date(promo.fecha_inicio);
          const fin = new Date(promo.fecha_fin);
          return hoy >= inicio && hoy <= fin;
        });
        
        // Aplica la mejor promoción disponible
        let mejorDescuento = 0;
        let tipoDescuento: 'Porcentaje' | 'CantidadFija' | null = null;

        promocionesVigentes.forEach((promo) => {
          const aplicaPorProducto =
            promo.referencia_id_producto === producto.id;
          const aplicaPorCategoria =
            promo.referencia_id_categoria === producto.categoria_id;

          if (aplicaPorProducto || aplicaPorCategoria) {
            if (promo.tipo === 'Porcentaje') {
              if (
                promo.valor > mejorDescuento ||
                tipoDescuento !== 'Porcentaje'
              ) {
                mejorDescuento = promo.valor;
                tipoDescuento = 'Porcentaje';
              }
            } else if (promo.tipo === 'CantidadFija') {
              const descuentoTotal = promo.valor;
              const precioConDescuento = producto.precio_base - descuentoTotal;

              const descuentoPrevio =
                tipoDescuento === 'Porcentaje'
                  ? producto.precio_base * (mejorDescuento / 100)
                  : mejorDescuento;

              if (descuentoTotal > descuentoPrevio || tipoDescuento === null) {
                mejorDescuento = descuentoTotal;
                tipoDescuento = 'CantidadFija';
              }
            }
          }
        });

        if (tipoDescuento === 'Porcentaje') {
          producto.precioFinal =
            producto.precio_base * (1 - mejorDescuento / 100);
          producto.tienePromocion = true;
        } else if (tipoDescuento === 'CantidadFija') {
          producto.precioFinal = producto.precio_base - mejorDescuento;
          producto.tienePromocion = true;
        } else {
          producto.precioFinal = producto.precio_base;
          producto.tienePromocion = false;
        }

        return producto;
      });
    });
  }

  detalle(id: Number) {
    this.router.navigate(['/producto', id]);
  }
  comprar(producto: ProductoModel) {
  if (producto.personalizable) {
    const dialogRef = this.dialog.open(ProductoPersonalizable, {
      width: '1000px',
      maxWidth: '95vw',
      data: producto,
    });

    dialogRef.afterClosed().subscribe((opcionesSeleccionadas) => {
      if (opcionesSeleccionadas) {
        // Aquí podrías agregar el producto al carrito con las opciones
        this.noti.success('Personalización', 'Producto personalizado agregado al carrito', 3000);
        console.log('Opciones:', opcionesSeleccionadas);
      }
    });
  } else {
    this.noti.success('Compra', 'Producto comprado: ' + producto.nombre, 3000);
  }
}


  cambiarImagen(producto: any, hover: boolean) {
    producto.imagenActual = hover
      ? producto.imagenes[1]?.url || producto.imagenes[0]?.url
      : producto.imagenes[0]?.url;
  }
}
