import { Component, OnInit } from '@angular/core';
import { CartService } from '../../share/cart.service';
import { PedidoService } from '../../share/services/pedido.service';
import { ItemCartModel } from '../../share/models/ItemCartModel';
import { MetodoPagoModel } from '../../share/models/MetodoPagoModel';
import { NotificationService } from '../../share/notification-service';
import { PedidoModel } from '../../share/models/PedidoModel';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito-component.html',
  styleUrls: ['./carrito-component.css'],
  standalone: false,
})
export class CarritoComponent implements OnInit {
  items: ItemCartModel[] = [];
  total: number = 0;
  direccion_envio: string = '';
  metodo_pago: string = 'Efectivo'; // valor inicial opcional

  constructor(
    private cartService: CartService,
    private pedidoService: PedidoService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.itemsCart();
    this.total = this.cartService.total();
  }

  incrementarCantidad(item: ItemCartModel): void {
    this.cartService.addToCart(item.producto, 1);
    this.ngOnInit();
  }

  decrementarCantidad(item: ItemCartModel): void {
    this.cartService.addToCart(item.producto, -1);
    this.ngOnInit();
  }

  eliminarProducto(id: number): void {
    this.cartService.removeFromCart(id);
    this.ngOnInit();
  }

  vaciarCarrito(): void {
    this.cartService.deleteCart();
    this.ngOnInit();
  }

  registrarPedido() {
    if (this.cartService.itemsCart().length > 0) {
      const pedido = {
        usuario_id: 1,
        direccion_envio: this.direccion_envio,
        metodo_pago: this.metodo_pago, // debe ser un string: 'Tarjeta', 'Efectivo', etc.
        items: this.cartService.itemsCart().map((item) => {
          if (item.producto_personalizado_id) {
            return {
              producto_personalizado_id: item.producto_personalizado_id,
              cantidad: item.cantidad,
            };
          }
          return {
            producto_id: item.producto.id,
            cantidad: item.cantidad,
          };
        }),
      };

      this.pedidoService.create(pedido as any).subscribe({
        next: (respuesta) => {
          this.cartService.deleteCart();
          this.noti.success(
            'Pedido creado',
            'Pedido #' + respuesta.id,
            3000,
            '/pedido-resumen'
          );
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
}
