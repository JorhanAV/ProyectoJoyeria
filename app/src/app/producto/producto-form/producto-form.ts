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
import { FileUploadService } from '../../share/services/images.service';

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

  currentFile?: File;
  preview: string = '';
  nameImage: string = 'image-not-found.jpg';
  previousImage: string | null = null;

  imagenesActuales: string[] = [];
  imagenesAEliminar: string[] = [];
  intentadoEnviar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private prodService: ProductoService,
    private catService: CategoriaService,
    private etiqService: EtiquetaService,
    private fileUploadService: FileUploadService,
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
      categoria_id: [1, Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      activo: [true],
      imagenes: [[]],
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
        this.imagenesPreview = producto.imagenes.map(
          (i) => 'http://localhost:3000/imagenes/' + i.url
        );

        this.imagenesActuales = producto.imagenes.map((i) => i.url);

        // Promedio valoración
        const visibles =
          producto.resenas?.filter((r) => r.visible !== false) || [];
        const total = visibles.reduce((acc, r) => acc + r.valoracion, 0);
        this.promedioValoracion = visibles.length ? total / visibles.length : 0;
      });
  }

  selectedFiles: File[] = [];
  previews: string[] = [];
  nameImages: string[] = [];

  selectFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log(input.files);
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      this.nameImages = this.selectedFiles.map((file) => file.name);

      this.previews = [];
      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.previews.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      this.selectedFiles = [];
      this.nameImages = [];
      this.previews = [];
    }
  }

  submitProducto(): void {
    this.intentadoEnviar = true;
    this.productoForm.markAllAsTouched();

    if (this.etiquetasSeleccionadas.length === 0) {
      this.noti.error(
        'Formulario Inválido',
        'Debe seleccionar al menos una etiqueta.',
        4000
      );
      return;
    } else if (this.productoForm.invalid) {
      this.noti.error(
        'Formulario Inválido',
        'Por favor, revise los campos marcados en rojo.',
        5000
      );
      return;
    }
    if (this.esEdicion) {
      this.actualizarImagenesProducto();
    } else {
      if (this.selectedFiles.length > 0) {
        this.fileUploadService.upload(this.selectedFiles).subscribe({
          next: (fileNames: string[]) => {
            this.noti.info(
              'Mantenimiento Producto',
              'Imágenes subidas correctamente.',
              4000
            );

            this.productoForm.patchValue({
              imagenes: fileNames,
            });

            this.guardarProducto();
          },
          error: (err) => {
            console.error('Error al subir imágenes:', err);
            this.noti.error('Error', 'Falló la subida de imágenes');
          },
        });
      } else {
        this.noti.warning(
          'Sin imágenes',
          'Seleccione al menos una imagen.',
          3000
        );
      }
    }
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

  actualizarImagenesProducto() {
    const formData = new FormData();
    formData.append('productoId', this.productoId.toString());

    this.selectedFiles.forEach((file) => formData.append('imagenes', file));
    this.imagenesAEliminar.forEach((nombre) =>
      formData.append('imagenesAEliminar', nombre)
    );

    this.fileUploadService.updateImagenes(this.productoId, formData).subscribe({
      next: (res) => {
        this.noti.success('Actualización completa', res.mensaje);
        this.guardarProducto();
      },
      error: (err) => {
        console.error('Error al actualizar imágenes:', err);
        this.noti.error('Error', 'No se pudieron actualizar las imágenes');
      },
    });
  }

  eliminarImagenActual(nombre: string) {
    this.imagenesAEliminar.push(nombre);
    this.imagenesActuales = this.imagenesActuales.filter((n) => n !== nombre);
  }
}
