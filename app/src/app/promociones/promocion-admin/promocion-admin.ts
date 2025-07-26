import { Component } from '@angular/core';
import { PromocionService } from '../../share/services/promocion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promocion-admin',
  standalone: false,
  templateUrl: './promocion-admin.html',
  styleUrl: './promocion-admin.css',
})
export class PromocionAdmin {
  promociones: any[] = [];
  today = new Date();

  constructor(
    private promocionService: PromocionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPromociones();
  }

  cargarPromociones(): void {
    this.promocionService.get().subscribe({
      next: (data) => {
        this.promociones = data;
      },
      error: (err) => {
        console.error('Error al cargar promociones:', err);
      },
    });
  }

  irACrear(): void {
    this.router.navigate(['/promocion/create']);
  }

  irAEditar(promo: any): void {
    this.router.navigate(['/promocion/update', promo.id]);
  }
  
  esEditable(promo: any): boolean {
    const inicio = new Date(promo.fecha_inicio);
    return inicio >= this.today;
  }
}
