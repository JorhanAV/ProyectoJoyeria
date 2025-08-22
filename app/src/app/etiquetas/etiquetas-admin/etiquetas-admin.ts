import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EtiquetaService } from '../../share/services/etiqueta.service';

@Component({
  selector: 'app-etiquetas-admin',
  standalone: false,
  templateUrl: './etiquetas-admin.html',
  styleUrl: './etiquetas-admin.css',
})
export class etiquetasAdmin {
  etiquetas: any[] = [];
  today = new Date();

  constructor(
    private etiquetasService: EtiquetaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEtiquetas();
  }

  cargarEtiquetas(): void {
    this.etiquetasService.get().subscribe({
      next: (data) => {
        this.etiquetas = data;
      },
      error: (err) => {
        console.error('Error al cargar etiquetas:', err);
      },
    });
  }

  irACrear(): void {
    this.router.navigate(['/etiquetas/create']);
  }

  irAEditar(etiqueta: any): void {
    this.router.navigate(['/etiquetas/update', etiqueta.id]);
  }
  verDetalle(id: number) {
    this.router.navigate(['/etiquetas/', id]);
  }
}
