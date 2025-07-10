import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuOpen = false;
  qtyItems: Number = 4;
  isAuth: boolean = true;
  user: string = 'user@email.com';
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
