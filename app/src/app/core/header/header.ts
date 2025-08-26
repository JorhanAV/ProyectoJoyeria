import { Component, inject, Signal } from '@angular/core';

import { CartService } from '../../share/cart.service';
import { AuthenticationService } from '../../share/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  cartService = inject(CartService);

  private authService = inject(AuthenticationService);
  isAuthenticated = this.authService.isAuthenticatedSignal;
  currentUser = this.authService.currentUserSignal;

  constructor(private router: Router) {}
  menuOpen = false;
  qtyItems: Signal<Number> = this.cartService.qtyItems;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['inicio']);
    //console.log(this.isAuthenticated);
  }
}
