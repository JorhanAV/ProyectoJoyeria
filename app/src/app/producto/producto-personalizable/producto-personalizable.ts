import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoModel } from '../../share/models/ProductoModel';
import { AtributoModel } from '../../share/models/AtributoModel';
import { AtributoService } from '../../share/services/atributo.service';
import { ValorAtributoModelService } from '../../share/services/valorAtributo.service';
import { ValorAtributoModel } from '../../share/models/ValorAtributoModel';
@Component({
  selector: 'app-producto-personalizable',
  standalone: false,
  templateUrl: './producto-personalizable.html',
  styleUrl: './producto-personalizable.css',
})
export class ProductoPersonalizable {
  atributos: AtributoModel[] = [];
  valoresAtributos: ValorAtributoModel[] = [];

  constructor(
    private atributoService: AtributoService,
    private valorAtributoService: ValorAtributoModelService,
    public dialogRef: MatDialogRef<ProductoPersonalizable>,
    @Inject(MAT_DIALOG_DATA) public producto: ProductoModel
  ) {
    /* this.cargarAtributos();
    this.cargarValoresAtributos(); */
    this.cargarDatos();
  }

  cargarDatos() {
    this.atributoService.get().subscribe((atributos: AtributoModel[]) => {
      this.atributos = atributos;
      this.valorAtributoService
        .get()
        .subscribe((valores: ValorAtributoModel[]) => {
          this.valoresAtributos = valores;
          console.log('Atributos:', this.atributos);
          console.log('Valores:', this.valoresAtributos);
        });
    });
  }

  obtenerOpciones(id_atributo: number): ValorAtributoModel[] {
    if (id_atributo === undefined) {
      console.warn('ID de atributo no definido');
      return [];
    }
    return this.valoresAtributos.filter(
      (val) => val.id_atributo === id_atributo
    );
  }

  /* cargarAtributos() {
    this.atributoService.get().subscribe((data: AtributoModel[]) => {
      console.log('Atributos cargados:', data);
      this.atributos = data;
    });
  }

  cargarValoresAtributos() {
    this.valorAtributoService.get().subscribe((data: ValorAtributoModel[]) => {
      console.log('Valores de atributos cargados:', data);
      this.valoresAtributos = data;
    });
  } */

  confirmar() {
    // Aquí podrías enviar las opciones al carrito o al backend
    this.dialogRef.close(this.atributos);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
