import { Component, Input } from '@angular/core';
import { ResenaService } from '../../../share/services/resena.service';
import { ReporteResenaService } from '../../../share/services/reporteResena.service';
import { ResenaModel } from '../../../share/models/ResenaModel';
import { ReporteResenaModel } from '../../../share/models/ReporteResenaModel';

@Component({
  selector: 'app-listado-resenas',
  standalone: false,
  templateUrl: './listado-resenas.html',
  styleUrl: './listado-resenas.css',
})
export class ListadoResenas {
  @Input() resenas: ResenaModel[] = [];
  columnas: string[] = ['usuario', 'comentario', 'valoracion', 'acciones'];

  constructor(private resenaService: ResenaService) {}

  eliminar(id: number) {
    // Aquí podrías emitir un evento o llamar a un servicio
    console.log('Eliminar reseña con ID:', id);
  }

  responder(resena: ResenaModel) {
    // Lógica para responder, abrir modal, etc.
    console.log('Responder a reseña:', resena);
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
