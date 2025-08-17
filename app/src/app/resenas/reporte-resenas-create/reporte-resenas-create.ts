import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reporte-resenas-create',
  standalone: false,
  templateUrl: './reporte-resenas-create.html',
  styleUrl: './reporte-resenas-create.css',
})
export class ReporteResenasCreate {
  @Input() resena: any;
  @Input() usuarioId!: number;
  @Output() reporteCreado = new EventEmitter<any>();
  @Output() cerrarModal = new EventEmitter<void>();

  comentario: string = '';

  enviarReporte() {
    if (!this.comentario.trim()) return;

    const payload = {
      comentario: this.comentario,
      resena_id: this.resena.id,
      usuario_id: this.usuarioId,
    };

    this.reporteCreado.emit(payload);
    this.cerrar();
  }

  cerrar() {
    this.cerrarModal.emit();
  }
}
