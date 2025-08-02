import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../share/notification-service';
import { PromocionService } from '../../share/services/promocion.service';
import { ProductoService } from '../../share/services/producto.service';
import { CategoriaService } from '../../share/services/categoria.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export const alMenosUnaSeleccionValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
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
  tipoDescuento: 'Porcentaje' | 'CantidadFija' = 'Porcentaje';
  titleForm: string = 'Crear';
  aplicaA = signal<'categoria' | 'producto' | null>(null);

  constructor(
    private fb: FormBuilder,
    private promocionService: PromocionService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private noti: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    effect(() => {
      const tipo = this.aplicaA();
      if (!this.formPromocion) return;

      if (tipo === 'categoria') {
        this.formPromocion.get('idproducto')?.setValue(null);
      } else if (tipo === 'producto') {
        this.formPromocion.get('idCategoria')?.setValue(null);
      }
    });
  }

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
    this.formPromocion = this.fb.group(
      {
        nombre: ['', Validators.required],
        tipo: ['Porcentaje', Validators.required],
        valor: [null, [Validators.required, Validators.min(0.01)]],
        fecha_inicio: ['', Validators.required],
        fecha_fin: ['', Validators.required],
        idCategoria: [null],
        idproducto: [null],
      },
      {
        validators: alMenosUnaSeleccionValidator,
      }
    );
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
    console.log(data);
    const esCategoria = !!data.referencia_id_categoria;
    const tipo = esCategoria ? 'categoria' : 'producto';
    // 2. Establecer la señal aplicaA ANTES de hacer patchValue
    this.aplicaA.set(tipo);
    this.formPromocion.patchValue({
      nombre: data.nombre,
      tipo: data.tipo,
      valor: data.valor,
      fecha_inicio: this.formatearParaDatetimeLocal(data.fecha_inicio),
      fecha_fin: this.formatearParaDatetimeLocal(data.fecha_fin),
      idCategoria: data.referencia_id_categoria || null,
      idproducto: data.referencia_id_producto || null,
    });
    this.tipoDescuento = data.tipoDescuento;
  }

  submitPromocion(): void {
    this.formPromocion.markAllAsTouched();

    const { fecha_inicio, fecha_fin } = this.formPromocion.value;
    if (new Date(fecha_inicio) < new Date()) {
      this.noti.error(
        this.translate.instant('PROMOCION_TEXT.FECHA_INVALIDA_TITULO'),
        this.translate.instant('PROMOCION_TEXT.FECHA_INVALIDA_INICIO')
      );
      return;
    }

    if (new Date(fecha_fin) < new Date(fecha_inicio)) {
      this.noti.error(
        this.translate.instant('PROMOCION_TEXT.FECHA_INVALIDA_TITULO'),
        this.translate.instant('PROMOCION_TEXT.FECHA_INVALIDA_FIN')
      );
      return;
    }

    if (this.formPromocion.invalid) {
      this.noti.error(
        this.translate.instant('PROMOCION_TEXT.FORMULARIO_INVALIDO_TITULO'),
        this.translate.instant('PROMOCION_TEXT.FORMULARIO_INVALIDO_MENSAJE'),
        4000
      );
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
          const titulo = this.translate.instant('PROMOCION_TEXT.CREADA_TITULO');
          const mensaje = this.translate.instant('PROMOCION_TEXT.CREADA_MENSAJE', {
            id: res.id,
          });
          this.noti.success(titulo, mensaje, 3000);
          this.router.navigate(['/promocion-admin']);
        });
    } else if (this.idPromocion !== null) {
      data.id = this.idPromocion;
      this.promocionService
        .update(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const titulo = this.translate.instant(
            'PROMOCION_TEXT.ACTUALIZADA_TITULO'
          );
          const mensaje = this.translate.instant(
            'PROMOCION_TEXT.ACTUALIZADA_MENSAJE',
            { id: this.idPromocion }
          );
          this.noti.success(titulo, mensaje, 3000);
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
