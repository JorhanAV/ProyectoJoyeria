import { Component, Input } from '@angular/core';
import { ResenaService } from '../../../share/services/resena.service';
import { ReporteResenaService } from '../../../share/services/reporteResena.service';
import { ResenaModel } from '../../../share/models/ResenaModel';
import { ReporteResenaModel } from '../../../share/models/ReporteResenaModel';

@Component({
  selector: 'app-listado-reportes',
  standalone: false,
  templateUrl: './listado-reportadas.html',
  styleUrl: './listado-reportadas.css',
})
export class ListadoReportadas {
  @Input() resenasReportadas: ReporteResenaModel[] = [];
  columnas: string[] = [
    'producto',
    'comentario',
    'comentarioResena',
    'acciones',
  ];

  constructor(private resenaService: ResenaService) {}

  aprobar(id: number) {
    // Marcar como aprobado en backend
    console.log('Aprobar reporte con ID:', id);
  }

  eliminar(id: number) {
    // Eliminar reseña reportada
    console.log('Eliminar reseña con ID:', id);
  }

  actualizarVisibilidad(resenaOrReporte: ResenaModel | ReporteResenaModel) {
    const resena =
      (resenaOrReporte as ReporteResenaModel).resena || resenaOrReporte;

    if (!resena || typeof resena.visible === 'undefined') {
      console.warn('Reseña inválida o sin campo "visible"');
      return;
    }

    const nuevoEstado = !resena.visible;

    const resenaActualizada: ResenaModel = {
      ...resena,
      visible: nuevoEstado,
    };

    this.resenaService.update(resenaActualizada).subscribe({
      next: (resenaResponse) => {
        resena.visible = resenaResponse.visible;
        console.log(
          `Reseña ${resena.id} actualizada a ${
            resena.visible ? 'visible' : 'oculta'
          }`
        );
      },
      error: (err) => {
        console.error('Error al actualizar estado de reseña:', err);
      },
    });
  }
}
