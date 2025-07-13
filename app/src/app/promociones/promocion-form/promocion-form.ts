import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../share/notification-service';
import { PromocionService } from '../../share/services/promocion.service';
import { ProductoService } from '../../share/services/producto.service';
import { CategoriaService } from '../../share/services/categoria.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const alMenosUnaSeleccionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const categoria = control.get('idCategoria')?.value;
  const producto = control.get('idproducto')?.value;

  if (!categoria && !producto) {
    return { requiereUnaSeleccion: true };
  }

  return null;
};

@Component({
  selector: 'app-promocion-form',
  templateUrl: './promocion-form.html',
  styleUrls: ['./promocion-form.css'],
  standalone: false,
})
export class PromocionForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formPromocion!: FormGroup;
  categorias: any[] = [];
  productos: any[] = [];
  isCreate: boolean = true;
  idPromocion: number | null = null;
  aplicaA: 'categoria' | 'producto' | null = null;
  tipoDescuento: 'Porcentaje' | 'CantidadFija' = 'Porcentaje';
  titleForm: string = 'Crear';

  constructor(
    private fb: FormBuilder,
    private promocionService: PromocionService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private noti: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCategorias();
    this.cargarProductos();

    this.route.params.subscribe((params: Params) => {
      this.idPromocion = params['id'];
      this.isCreate = this.idPromocion === undefined;
      this.titleForm = this.isCreate ? 'Crear' : 'Actualizar';

      if (!this.isCreate && this.idPromocion) {
        this.promocionService
          .getById(this.idPromocion)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => this.patchFormValues(data));
      }
    });

  }

  private initForm(): void {
    this.formPromocion = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['Porcentaje', Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      idCategoria: [null],
      idproducto: [null],
    }, {
    validators: alMenosUnaSeleccionValidator
  });
  }

  cargarCategorias(): void {
    this.categoriaService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.categorias = data));
  }

  cargarProductos(): void {
    this.productoService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.productos = data));
  }

  private patchFormValues(data: any): void {
    console.log(data)
    this.formPromocion.patchValue({
      nombre: data.nombre,
      tipo: data.tipo,
      aplicaA: data.idCategoria ? 'categoria' : 'producto',
      valor: data.valor,
      fecha_inicio: this.formatearParaDatetimeLocal(data.fecha_inicio),
      fecha_fin: this.formatearParaDatetimeLocal(data.fecha_fin),
      idCategoria: data.referencia_id_categoria || null,
      idproducto: data.referencia_id_producto || null,
    });
    this.aplicaA = data.idCategoria ? 'categoria' : 'producto';
    this.tipoDescuento = data.tipoDescuento;
  }

  submitPromocion(): void {
    this.formPromocion.markAllAsTouched();

    const { fecha_inicio, fecha_fin } = this.formPromocion.value;
    if (new Date(fecha_inicio) < new Date()) {
      this.noti.error(
        'Fecha inválida',
        'La fecha de inicio no puede ser anterior a hoy.'
      );
      return;
    }

    if (new Date(fecha_fin) < new Date(fecha_inicio)) {
      this.noti.error(
        'Fecha inválida',
        'La fecha de fin no puede ser anterior a la de inicio.'
      );
      return;
    }

    if (this.formPromocion.invalid) {
      this.noti.error('Formulario inválido', 'Revisá los campos.', 4000);
      return;
    }

    const data = {
      ...this.formPromocion.value,
      fecha_inicio: this.convertirFecha(this.formPromocion.value.fecha_inicio),
      fecha_fin: this.convertirFecha(this.formPromocion.value.fecha_fin),
    };

    console.log(data);
    if (this.isCreate) {
      this.promocionService
        .create(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.noti.success('Promoción creada', `ID: ${res.id}`, 3000);
          this.router.navigate(['/promocion-admin']);
        });
    } else if (this.idPromocion !== null) {
      data.id = this.idPromocion;
      this.promocionService
        .update(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.noti.success('Promoción actualizada', '', 3000);
          this.router.navigate(['/promocion-admin']);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  alMenosUnaSeleccionValidator(form: FormGroup) {
    const categoria = form.get('idCategoria')?.value;
    const producto = form.get('idproducto')?.value;
    if (!categoria && !producto) {
      console.log(categoria);
      console.log(producto);
      return { alMenosUnaSeleccion: true };
    }
    return null;
  }
  convertirFecha(fechaInput: string): string {
    const date = new Date(fechaInput);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = '00'; // segundos fijos
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }
  formatearParaDatetimeLocal(fechaISO: string | null | undefined): string {
    if (!fechaISO) return '';

    const date = new Date(fechaISO);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }
}
