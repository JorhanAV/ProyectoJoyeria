import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductoModel } from '../../share/models/ProductoModel';
import { AtributoModel } from '../../share/models/AtributoModel';
import { AtributoService } from '../../share/services/atributo.service';
import { ValorAtributoModelService } from '../../share/services/valorAtributo.service';
import { ValorAtributoModel } from '../../share/models/ValorAtributoModel';
import { ProductoPersonalizableService } from '../../share/services/productoPersonalizable.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';
import { ProductoPersonalizableModel } from '../../share/models/ProductoPersonalizableModel';
import { ProductoPersonalizableCreateModel } from '../../share/models/ProductoPersonalizableDTO';

@Component({
  selector: 'app-producto-personalizable',
  standalone: false,
  templateUrl: './producto-personalizable.html',
  styleUrl: './producto-personalizable.css',
})
export class ProductoPersonalizable {
  atributos: AtributoModel[] = [];
  valoresAtributos: ValorAtributoModel[] = [];

  seleccionados: { [id_atributo: number]: ValorAtributoModel } = {};

  constructor(
    private atributoService: AtributoService,
    private valorAtributoService: ValorAtributoModelService,
    private productoPersonalizableService: ProductoPersonalizableService,
    private noti: NotificationService,
    private translate: TranslateService,

    public dialogRef: MatDialogRef<ProductoPersonalizable>,
    @Inject(MAT_DIALOG_DATA) public producto: ProductoModel
  ) {
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

  seleccionarValor(id_atributo: number, valor: ValorAtributoModel) {
    this.seleccionados[id_atributo] = valor;
  }

  confirmar() {
    const valoresSeleccionados = Object.values(this.seleccionados);
    console.log('Valores seleccionados:', valoresSeleccionados);

    // Validación: asegurarse de que todos los atributos tengan selección
    if (valoresSeleccionados.length !== this.atributos.length) {
      alert('Por favor selecciona una opción para cada atributo.');
      return;
    }

    // 🧠 Construcción del nombre
    const nombre = `${this.producto.nombre} - ${valoresSeleccionados
      .map((v) => v.valor)
      .join(', ')}`;

    // 📝 Template de descripción
    const descripcion_general = `Este producto personalizado incluye: ${valoresSeleccionados
      .map((v) => {
        const atributo = this.atributos.find((a) => a.id === v.id_atributo);
        return `${atributo?.nombre}: ${v.valor}`;
      })
      .join(', ')}.`;

    // 🧱 Construcción del objeto final
    const productoPersonalizado: ProductoPersonalizableCreateModel = {
      nombre,
      descripcion_general,
      id_categoria: this.producto.categoria_id,
      id_producto_base: this.producto.id,
    };

    console.log('Producto personalizado:', productoPersonalizado);

    this.productoPersonalizableService
      .createProductoPersonalizable(productoPersonalizado)
      .subscribe((productoCreado) => {
        const nuevoId = productoCreado.id;
        console.log('Producto personalizado creado con ID:', nuevoId);
      });

    // Podés enviarlo al servicio si querés persistirlo
    // this.productoPersonalizableService.create(productoPersonalizado).subscribe(...);

    this.dialogRef.close(productoPersonalizado);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
