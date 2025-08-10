import { Component, inject, Signal } from '@angular/core';

import { CartService } from '../../share/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartService=inject(CartService)
  menuOpen = false;
  qtyItems: Signal<Number>=this.cartService.qtyItems
  isAuth: boolean = true;
  user: string = 'user@email.com';
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
