import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected title = 'app';
   constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('es');
    this.translate.use('es'); // Idioma inicial
  }

  cambiarIdioma(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const idioma = selectElement.value;
    this.translate.use(idioma);
  }
}
