import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../share/cart.service';
import { PedidoService } from '../../share/services/pedido.service';
import { ItemCartModel } from '../../share/models/ItemCartModel';
import { MetodoPagoModel } from '../../share/models/MetodoPagoModel';
import { NotificationService } from '../../share/notification-service';
import { PedidoModel } from '../../share/models/PedidoModel';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { PagoModalComponent } from './ProcesoPago/pago-modal';
import { Subscription, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from '../../share/services/usuario.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito-component.html',
  styleUrls: ['./carrito-component.css'],
  standalone: false,
})
export class CarritoComponent implements OnInit {
  items: ItemCartModel[] = [];
  total: number = 0;
  impuestos: number = 0;
  direccion_envio: string = '';
  metodo_pago: string = 'Efectivo';
  usuarioId: number=1;
  estadoPedido: string = 'En carrito';
  pedidoId: number = 0;
  nombreUsuario: string = '';
  correoUsuario: string = '';
  fechaActual: string = '';
  private langSub!: Subscription;

  constructor(
    private cartService: CartService,
    private pedidoService: PedidoService,
    private noti: NotificationService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private usuarioService: UsuarioService
  ) {

  }

  ngOnInit(): void {
    this.items = this.cartService.itemsCart();
    this.total = this.cartService.total();
    this.impuestos = this.cartService.impuestos();
    this.obtenerUsuario(); 
    
    // inicializa con el idioma actual
    this.setFecha(this.translate.currentLang || this.translate.getDefaultLang());

    // escucha cambios de idioma
    this.langSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setFecha(event.lang);
    });
  }
    ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

   private setFecha(lang: string) {
    this.fechaActual =
      lang === 'es'
        ? new Date().toLocaleDateString('es-CR')
        : new Date().toLocaleDateString('en-US');
  }
incrementarCantidad(item: ItemCartModel): void {
  if (item.producto) {
    if (item.cantidad < (item.producto.stock ?? 0)) {
      this.cartService.addToCart(item.producto);
    } else {
      this.noti.warning(
        'Stock insuficiente',
        `Solo hay ${item.producto.stock} unidades disponibles`,
        3000
      );
    }
  } else if (item.productoPersonalizado) {
    this.cartService.addToCartPersonalized(item.productoPersonalizado);
  }
  this.ngOnInit();
}

  decrementarCantidad(item: ItemCartModel): void {
    if (item.producto) {
      this.cartService.addToCart(item.producto,-1);
    } else if (item.productoPersonalizado) {
      this.cartService.addToCartPersonalized(item.productoPersonalizado,-1);
    }
    this.ngOnInit();
  }
  eliminarProducto(item: ItemCartModel): void {
    if (item.producto) {
      this.cartService.removeFromCartByProductoId(item.producto.id);
    } else if (item.productoPersonalizado) {
      this.cartService.removeFromCartByPersonalizadoId(
        item.productoPersonalizado.id
      );
      this.cartService.removeFromCartByPersonalizadoId(
        item.productoPersonalizado.id
      );
    }
    this.ngOnInit();
  }
  getPrecioUnitarioPersonalizado(item: ItemCartModel): number {
    if (!item.productoPersonalizado) return 0;
    const base = item.productoPersonalizado.precio_base || 0;
    const extras =
      item.productoPersonalizado.criterios?.reduce(
        (acc, c) => acc + (c.precio_extra || 0),
        0
      ) || 0;
    return base + extras;
  }
  vaciarCarrito(): void {
    this.cartService.deleteCart();
    this.ngOnInit();
  }
  abrirModalPago() {
    const metodo = this.metodo_pago; // ya definido
    const total = this.total; // total del pedido a pagar
    this.dialog
      .open(PagoModalComponent, {
        width: '90vw',
        height: '90vh',
        panelClass: 'modal-pago-panel',
        data: {
          metodo_pago: metodo,
          total: total,
        },
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado) {
          console.log(this.pedidoId);
          this.pedidoService.pagarpedido(this.pedidoId, 1).subscribe(
            () => {
              this.noti.success(
                'Pago realizado',
                'Pedido actualizado',
                3000,
                '/pedidos'
              );
            },
            (error) => {
              this.noti.error('Error en el pago', error.message || '', 3000);
            }
          );
        }
      });
  }
  registrarPedido() {
    if (this.cartService.itemsCart().length > 0) {
      const pedido = {
        usuario_id: this.usuarioId,
        direccion_envio: this.direccion_envio,
        metodo_pago: this.metodo_pago,
        items: this.cartService.itemsCart().map((item) => {
          if (item.producto) {
            return {
              producto_id: item.producto.id,
              cantidad: item.cantidad,
            };
          } else {
            return {
              producto_personalizado_id: item.productoPersonalizado!.id,
              cantidad: item.cantidad,
            };
          }
        }),
      };

      this.pedidoService.create(pedido as any).subscribe({
        next: (respuesta) => {
          // Guardas el ID del pedido creado
          this.pedidoId = respuesta.id;

          // Limpias el carrito (puedes decidir si hacer esto aquí o luego de pagar)
          // Guardas el ID del pedido creado
          this.pedidoId = respuesta.id;

          // Limpias el carrito (puedes decidir si hacer esto aquí o luego de pagar)
          this.cartService.deleteCart();

          // Muestras la notificación

          // Muestras la notificación
          this.noti.success(
            'Pedido creado',
            'Pedido #' + respuesta.id,
            3000,
            '/pedidos'
          );
          // Abrir modal de pago con método y total
          this.abrirModalPago();
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          console.error(err);
          this.noti.error('Error al crear el pedido', err.message || '', 3000);
        },
      });
    } else {
      this.noti.warning('Crear pedido', 'Agregue productos al carrito', 3000);
    }
  }
  obtenerUsuario() {
    this.usuarioService.getById(this.usuarioId).subscribe((usuario) => {
      this.nombreUsuario = usuario.nombre_usuario;
      this.correoUsuario = usuario.correo;
    });
  }
}
