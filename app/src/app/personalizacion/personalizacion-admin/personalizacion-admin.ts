import { Component } from '@angular/core';
import { ValorAtributoModelService } from '../../share/services/valorAtributo.service';
import { ValorAtributoModel } from '../../share/models/ValorAtributoModel';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personalizacion-admin',
  standalone: false,
  templateUrl: './personalizacion-admin.html',
  styleUrl: './personalizacion-admin.css'
})
export class PersonalizacionAdmin {

  constructor(
    private personalizacionService: ValorAtributoModelService,
    private noti: NotificationService,
    private translate: TranslateService
  ){}

  opciones: ValorAtributoModel[] = [];

  ngOnInit(): void {
    this.personalizacionService.get().subscribe({
      next: (data) => this.opciones = data,
      error: (err) => console.error('Error al cargar opciones', err)
    });
  }

  get agrupadasPorAtributo(): { nombre: string; opciones: ValorAtributoModel[] }[] {
    const mapa = new Map<string, ValorAtributoModel[]>();
    for (const opcion of this.opciones) {
      const nombre = opcion.atributo.nombre;
      if (!mapa.has(nombre)) mapa.set(nombre, []);
      mapa.get(nombre)!.push(opcion);
    }
    return Array.from(mapa.entries()).map(([nombre, opciones]) => ({ nombre, opciones }));
  }

  update(opcion: ValorAtributoModel) {
  this.personalizacionService.update(opcion).subscribe({
    next: () => {
      this.noti.success(
        this.translate.instant('PERSONALIZACION_TEXT.ACTUALIZAR_TITULO'),
        this.translate.instant('PERSONALIZACION_TEXT.ACTUALIZAR_MENSAJE'),
        2000
      );
      console.log(`Opción actualizada: ${opcion.valor}`);
    },
    error: (err) => {
      this.noti.error(
        'Error al actualizar',
        'Intenta nuevamente o verifica el precio',
        3000
      );
      console.error('Error al actualizar opción', err);
    }
  });
}


}
