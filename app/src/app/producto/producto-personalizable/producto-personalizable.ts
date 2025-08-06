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
import { ProductoPersonalizableCreateModel } from '../../share/models/ProductoPersonalizableDTO';
import { VarianteDetalleService } from '../../share/services/varianteDetalle.service';
import { switchMap } from 'rxjs';

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
    private varianteDetalleService: VarianteDetalleService,
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

  getImagenesSeleccionadas(): string[] {
    return Object.values(this.seleccionados)
      .filter((v) => v?.imagen)
      .map((v) => `http://localhost:3000/imagenes/${v.imagen}`);
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
      this.noti.error(
        this.translate.instant('PRODUCTO_TEXT.ATRIBUTO_REQUERIDO_TITULO'),
        this.translate.instant('PRODUCTO_TEXT.ATRIBUTO_REQUERIDO_MENSAJE'),
        2000
      );
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
      .pipe(
        switchMap((productoCreado) => {
          const nuevoId = productoCreado.id;
          const id_valores = valoresSeleccionados.map((v) => v.id);
          console.log('Producto personalizado creado con ID:', nuevoId);
          console.log('IDs de valores seleccionados:', id_valores);

          // Aquí llamamos al servicio para guardar los detalles
          return this.varianteDetalleService.createBatch({
            id_productoPersonalizable: nuevoId,
            id_valores,
          });
        })
      )
      .subscribe({
        next: (detallesCreados) => {
          console.log('Detalles de variantes creados:', detallesCreados);
        },
        error: (err) => {
          console.error('Error al crear producto o variantes:', err);
        },
      });

    this.dialogRef.close(productoPersonalizado);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
