import { Injectable, signal, computed, effect } from '@angular/core';
import { ItemCartModel } from './models/ItemCartModel';
import { ProductoModel } from './models/ProductoModel'; // Suponemos que lo tenés

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
    this.cart().reduce((total, item) => total + item.subtotal, 0)
  );

  constructor() {
    effect(() => {
      localStorage.setItem('orden', JSON.stringify(this.cart()));
    });
  }

  private loadCartFromStorage(): ItemCartModel[] {
    const cartData = localStorage.getItem('orden');
    return cartData ? JSON.parse(cartData) : [];
  }

  private calculateSubtotal(producto: ProductoModel, cantidad: number): number {
    return producto.precio_base * cantidad;
  }

  addToCart(producto: ProductoModel, quantity?: number): void {
    this.cart.update((currentCart) => {
      const listCart = [...currentCart];
      const existingItemIndex = listCart.findIndex(
        (item) => item.producto.id === producto.id
      );

      if (existingItemIndex !== -1) {
        const existingItem = listCart[existingItemIndex];
        const newQuantity = quantity !== undefined
          ? existingItem.cantidad + Number(quantity)
          : existingItem.cantidad + 1;

        if (newQuantity <= 0) {
          listCart.splice(existingItemIndex, 1);
        } else {
          listCart[existingItemIndex] = {
            ...existingItem,
            cantidad: newQuantity,
            subtotal: this.calculateSubtotal(existingItem.producto, newQuantity),
          };
        }
      } else {
        listCart.push({
          producto,
          cantidad: quantity ? Number(quantity) : 1,
          subtotal: this.calculateSubtotal(producto, quantity ? Number(quantity) : 1),
        });
      }

      return listCart;
    });
  }

  removeFromCart(productId: number): void {
    this.cart.update((currentCart) =>
      currentCart.filter((item) => item.producto.id !== productId)
    );
  }

  deleteCart(): void {
    this.cart.set([]);
  }

  setCart(items: ItemCartModel[]): void {
    this.cart.set(items);
  }
}
