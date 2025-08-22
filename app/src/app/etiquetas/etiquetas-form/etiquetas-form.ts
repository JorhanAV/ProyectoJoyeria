import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EtiquetaService } from '../../share/services/etiqueta.service';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';

// Validador: al menos un producto seleccionado
export const requiereUnProductoValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const productos = control.get('productosIds')?.value;
  if (!productos || productos.length === 0) {
    return { requiereUnProducto: true };
  }
  return null;
};

@Component({
  selector: 'app-etiquetas-form',
  templateUrl: './etiquetas-form.html',
  styleUrls: ['./etiquetas-form.css'],
  standalone: false,
})
export class etiquetasForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formEtiqueta!: FormGroup;
  productosDisponibles: any[] = [];
  productosSeleccionados: number[] = [];
  isCreate: boolean = true;
  idEtiqueta: number | null = null;

  constructor(
    private fb: FormBuilder,
    private etiquetasService: EtiquetaService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarProductos();

    this.route.params.subscribe((params: Params) => {
      this.idEtiqueta = params['id'];
      this.isCreate = this.idEtiqueta === undefined;

      if (!this.isCreate && this.idEtiqueta) {
        this.etiquetasService
          .getById(this.idEtiqueta)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => this.patchFormValues(data));
      }
    });
  }
    goback() {
    this.router.navigate(['/etiquetas-admin']);
  }

  private initForm(): void {
    this.formEtiqueta = this.fb.group(
      {
        nombre: ['', Validators.required],
        productosIds: [[]],
      },
      { validators: requiereUnProductoValidator }
    );
  }

  cargarProductos(): void {
    this.productoService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.productosDisponibles = res));
  }

  private patchFormValues(data: any): void {
    this.formEtiqueta.patchValue({
      nombre: data.nombre,
      productosIds: data.productos?.map((p: any) => p.id) || [],
    });
    this.productosSeleccionados = data.productos?.map((p: any) => p.id) || [];
  }

  submitEtiqueta(): void {
    this.formEtiqueta.markAllAsTouched();
    if (this.formEtiqueta.invalid) {
      this.noti.error('Formulario inválido', 'Revise los campos obligatorios', 3000);
      return;
    }

    const payload = {
      id: this.isCreate ? undefined : this.idEtiqueta,
      nombre: this.formEtiqueta.value.nombre,
      productosIds: this.productosSeleccionados.map((id) => ({ id })),
    };

    if (this.isCreate) {
      this.etiquetasService
        .create(payload as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.noti.success('Etiqueta creada', 'La etiqueta fue creada exitosamente', 3000);
          this.router.navigate(['/etiquetas-admin']);
        });
    } else {
      this.etiquetasService
        .update(payload as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.noti.success('Etiqueta actualizada', 'La etiqueta fue actualizada exitosamente', 3000);
          this.router.navigate(['/etiquetas-admin']);
        });
    }
  }

  toggleProducto(productoId: number): void {
    if (this.productosSeleccionados.includes(productoId)) {
      this.productosSeleccionados = this.productosSeleccionados.filter(
        (id) => id !== productoId
      );
    } else {
      this.productosSeleccionados.push(productoId);
    }
    this.formEtiqueta.get('productosIds')?.setValue(this.productosSeleccionados);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
