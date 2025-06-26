import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  imagenes = [
    { src: 'images/collar1.jpg', alt: 'Collar Elegante' },
    { src: 'images/collar2.jpg', alt: 'Collar Moderno' },
    { src: 'images/anillo1.jpg', alt: 'Anillo Brillante' },
    { src: 'images/pulsera1.jpg', alt: 'Pulsera Clásica' }
  ];

}
