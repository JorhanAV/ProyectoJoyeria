import { Component } from '@angular/core';
import { ProductoModel } from '../../share/models/ProductoModel';
import { EtiquetaModel } from '../../share/models/EtiquetaModel';
import { CategoriaModel } from '../../share/models/CategoriaModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../share/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';

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
   /*  private catService: CategoriaService,
    private etiqService: EtiquetaService, */
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productoId = +this.route.snapshot.paramMap.get('id')!;
    this.esEdicion = !!this.productoId;

    this.initForm();
    // this.cargarCategorias();
    // this.cargarEtiquetas();

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
    });
  }

  // cargarCategorias() {
  //   this.catService.get().subscribe((res: CategoriaModel[]) => {
  //     this.categorias = res;
  //   });
  // }

  // cargarEtiquetas() {
  //   this.etiqService.get().subscribe((res: EtiquetaModel[]) => {
  //     this.etiquetas = res;
  //   });
  // }

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

  /* guardarProducto() {
    if (this.productoForm.invalid) return;

    const datos = {
      ...this.productoForm.value,
      etiquetas: this.etiquetasSeleccionadas,
      imagenes: this.imagenesArchivos, // suponiendo que el backend las procesa aquí
    };

    if (this.esEdicion) {
      this.prodService.update(this.productoId, datos).subscribe(() => {
        this.router.navigate(['/productos/admin']);
      });
    } else {
      this.prodService.create(datos).subscribe(() => {
        this.router.navigate(['/productos/admin']);
      });
    }
  } */
}
