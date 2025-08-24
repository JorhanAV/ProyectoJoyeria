import { Injectable, signal, computed, effect } from '@angular/core';
import { ItemCartModel } from './models/ItemCartModel';
import { ProductoModel } from './models/ProductoModel'; // Suponemos que lo tenés
import { ProductoPersonalizableModel } from './models/ProductoPersonalizableModel';
import { ProductoPersonalizableCreateModel } from './models/ProductoPersonalizableDTO';
import { PedidoService } from './services/pedido.service';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = signal<ItemCartModel[]>(this.loadCartFromStorage());
  public readonly itemsCart = computed(() => this.cart());
  public qtyItems = computed(() =>
    this.cart().reduce((sum, item) => sum + item.cantidad, 0)
  );
  public total = computed(() =>
    this.cart().reduce((total, item) => (total + item.subtotal) * 1.13, 0)
  );
  public impuestos = computed(() =>
    this.cart().reduce((total, item) => (total + item.subtotal) * 0.13, 0)
  );

 constructor(
    private pedidoService: PedidoService,
    private noti: NotificationService 
  ) {
    effect(() => {
      localStorage.setItem('orden', JSON.stringify(this.cart()));
    });
  }

  private loadCartFromStorage(): ItemCartModel[] {
    const cartData = localStorage.getItem('orden');
    return cartData ? JSON.parse(cartData) : [];
  }
 guardarCarrito() {
    if (this.cart().length === 0) return;

    const pedido = {
      usuario_id: Number(localStorage.getItem('usuarioID')),
      direccion_envio: localStorage.getItem('direccion_envio')||'',
      metodo_pago: localStorage.getItem('metodo_pago') || 'Efectivo',
      items: this.cart().map((item) =>
        item.producto
          ? { producto_id: item.producto.id, cantidad: item.cantidad }
          : {
              producto_personalizado_id: item.productoPersonalizado!.id,
              cantidad: item.cantidad,
            }
      ),
    };
    console.log(pedido)
    this.pedidoService.guardarCarrito(pedido).subscribe({
      next: () => {
        this.noti.success(
          'Carrito guardado',
          'Se cargará en tu próxima sesión',
          3000
        );
      },
      error: (err) => {
        this.noti.error(
          'Error al guardar carrito',
          err.message || '',
          3000
        );
      },
    });
  }
  loadCartFromBackend(usuarioId: number) {
    console.log("loadCAart")
  this.pedidoService.getCarritoActivo(usuarioId).subscribe({
    next: (pedido: any) => {
      if (pedido && pedido.items) {
        const items: ItemCartModel[] = pedido.items.map((i: any) => {
          if (i.producto) {
            return {
              producto: i.producto,
              cantidad: i.cantidad,
              subtotal: this.calculateSubtotalProducto(i.producto, i.cantidad),
            };
          } else {
            return {
              productoPersonalizado: i.producto_Personalizado,
              cantidad: i.cantidad,
              subtotal: this.calculateSubtotalPersonalizado(
                i.productoPersonalizado,
                i.cantidad
              ),
            };
          }
        });
        console.log(items)
        this.setCart(items);
      }
    },
    error: () => {
      console.log('No hay carrito activo');
    }
  });
}

  private calculateSubtotalProducto(
    producto: ProductoModel,
    cantidad: number
  ): number {
    if (!producto.tienePromocion) {
      return producto.precio_base * cantidad;
    } else {
      if (producto.precioFinal) return producto.precioFinal * cantidad;
    }
    return 0;
  }

  private calculateSubtotalPersonalizado(
    itemPersonalizado: ProductoPersonalizableCreateModel,
    cantidad: number
  ): number {
    const totalExtras = itemPersonalizado?.criterios?.reduce(
      (acc, c) => acc + c.precio_extra,
      0
    );
    if (itemPersonalizado && totalExtras) {
      return (itemPersonalizado.precio_base + totalExtras) * cantidad;
    } else {
      return 0;
    }
  }

  addToCart(producto?: ProductoModel, cantidad: number = 1): void {
    this.cart.update((currentCart) => {
      const listCart = [...currentCart];

      if (producto) {
        // Buscamos por producto estándar
        const existingIndex = listCart.findIndex(
          (item) =>
            item.producto?.id === producto.id && !item.productoPersonalizado
        );
        if (existingIndex !== -1) {
          const existingItem = listCart[existingIndex];
          const newQuantity = existingItem.cantidad + cantidad;
          if (newQuantity <= 0) {
            listCart.splice(existingIndex, 1);
          } else {
            listCart[existingIndex] = {
              ...existingItem,
              cantidad: newQuantity,
              subtotal: this.calculateSubtotalProducto(producto, newQuantity),
            };
          }
        } else if (cantidad > 0) {
          listCart.push({
            producto,
            cantidad,
            subtotal: this.calculateSubtotalProducto(producto, cantidad),
          });
        }
      }
      return listCart;
    });
  }
  addToCartPersonalized(
    productoPersonalizado?: ProductoPersonalizableCreateModel,
    cantidad: number = 1
  ): void {
    this.cart.update((currentCart) => {
      const listCart = [...currentCart];

      // Buscamos por producto personalizado id
      const existingIndex = listCart.findIndex(
        (item) => item.productoPersonalizado?.id === productoPersonalizado?.id
      );
      if (existingIndex !== -1) {
        const existingItem = listCart[existingIndex];
        const newQuantity = existingItem.cantidad + cantidad;
        if (newQuantity <= 0) {
          listCart.splice(existingIndex, 1);
        } else {
          if (productoPersonalizado)
            listCart[existingIndex] = {
              ...existingItem,
              cantidad: newQuantity,
              subtotal: this.calculateSubtotalPersonalizado(
                productoPersonalizado,
                newQuantity
              ),
            };
        }
      } else if (cantidad > 0) {
        if (productoPersonalizado)
          listCart.push({
            productoPersonalizado,
            cantidad,
            subtotal: this.calculateSubtotalPersonalizado(
              productoPersonalizado,
              cantidad
            ),
          });
      }
      return listCart;
    });
  }

  removeFromCartByProductoId(productId: number): void {
    this.cart.update((currentCart) =>
      currentCart.filter((item) => item.producto?.id !== productId)
    );
  }

  removeFromCartByPersonalizadoId(personalizadoId: number): void {
    this.cart.update((currentCart) =>
      currentCart.filter(
        (item) => item.productoPersonalizado?.id !== personalizadoId
      )
    );
  }

  deleteCart(): void {
    this.cart.set([]);
  }

  setCart(items: ItemCartModel[]): void {
    this.cart.set(items);
  }
}
