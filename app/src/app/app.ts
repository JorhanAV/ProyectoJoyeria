import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from './share/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'app';
   constructor(private translate: TranslateService,
   private cartService: CartService
   ) {
    this.translate.setDefaultLang('es');
    this.translate.use('es'); // Idioma inicial
  }

  cambiarIdioma(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const idioma = selectElement.value;
    this.translate.use(idioma);
  }
  @HostListener('window:beforeunload', ['$event'])
handleBeforeUnload(event: BeforeUnloadEvent) {
  if (this.cartService.itemsCart().length > 0) {
    this.cartService.guardarCarrito(); // ahora guarda en backend
    event.preventDefault();
    event.returnValue = ''; 
  }
}

}
