import { Component } from '@angular/core';
import { ProductoModel } from '../../share/models/ProductoModel';
import { EtiquetaModel } from '../../share/models/EtiquetaModel';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../share/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../share/services/categoria.service';
import { EtiquetaService } from '../../share/services/etiqueta.service';
import { NotificationService } from '../../share/notification-service';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm {
  productoForm!: FormGroup;
  esEdicion: boolean = false;
  productoId!: number;

  categorias: CategoriaModel[] = [];
  etiquetas: EtiquetaModel[] = [];
  etiquetasSeleccionadas: number[] = [];

  imagenesArchivos: File[] = [];
  imagenesPreview: string[] = [];

  promedioValoracion: number = 0;

  constructor(
    private fb: FormBuilder,
    private prodService: ProductoService,
    private catService: CategoriaService,
    private etiqService: EtiquetaService,
    private route: ActivatedRoute,
    private router: Router,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.productoId = +this.route.snapshot.paramMap.get('id')!;
    this.esEdicion = !!this.productoId;

    this.initForm();
    this.cargarCategorias();
    this.cargarEtiquetas();

    if (this.esEdicion) {
      this.cargarProducto();
    }
  }

  initForm() {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio_base: [0, [Validators.required, Validators.min(0)]],
      categoria_id: [null, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true],
    });
  }

  cargarCategorias() {
    this.catService.get().subscribe((res: CategoriaModel[]) => {
      this.categorias = res;
    });
  }

  cargarEtiquetas() {
    this.etiqService.get().subscribe((res: EtiquetaModel[]) => {
      this.etiquetas = res;
    });
  }

  toggleEtiqueta(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.etiquetasSeleccionadas.push(id);
    } else {
      this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(
        (e) => e !== id
      );
    }
  }

  onImagenesSeleccionadas(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.imagenesArchivos = Array.from(files);
      this.imagenesPreview = this.imagenesArchivos.map((f) =>
        URL.createObjectURL(f)
      );
    }
  }

  cargarProducto() {
    this.prodService
      .getById(this.productoId)
      .subscribe((producto: ProductoModel) => {
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio_base: producto.precio_base,
          categoria_id: producto.categoria_id,
          stock: producto.stock,
          activo: producto.activo,
        });

        // Etiquetas
        this.etiquetasSeleccionadas = producto.etiquetas.map(
          (e) => e.etiqueta.id
        );

        // Imágenes (solo preview si vienen URLs)
        this.imagenesPreview = producto.imagenes.map((i) => 'images/' + i.url);

        // Promedio valoración
        const visibles =
          producto.resenas?.filter((r) => r.visible !== false) || [];
        const total = visibles.reduce((acc, r) => acc + r.valoracion, 0);
        this.promedioValoracion = visibles.length ? total / visibles.length : 0;
      });
  }

  guardarProducto() {
    if (this.productoForm.invalid) return;

    const datos = {
      ...this.productoForm.value,
      ...(this.esEdicion && { id: this.productoId }),
      etiquetas: this.etiquetasSeleccionadas.map((id) => ({ etiqueta_id: id })),
      categoria_id: Number(this.productoForm.value.categoria_id),

      //imagenes: this.imagenesArchivos, // suponiendo que el backend las procesa aquí
    };
    console.log('Datos a guardar:', datos);
    if (this.esEdicion) {
      this.prodService.update(datos).subscribe(() => {
        this.router.navigate(['/producto-admin']);
        this.noti.success(
          'Actualizar Producto',
          `Producto actualizado: ${datos.nombre}`,
          3000,
          '/producto-admin'
        );
      });
    } else {
      this.prodService.create(datos).subscribe(() => {
        this.noti.success(
          'Crear Producto',
          `Producto creado: ${datos.nombre}`,
          3000,
          '/producto-admin'
        );
        this.router.navigate(['/producto-admin']);
      });
    }
  }
}
