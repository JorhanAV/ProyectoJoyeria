import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResenaModel } from '../../share/models/ResenaModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResenaService } from '../../share/services/resena.service';
import { NotificationService } from '../../share/notification-service';
import { UsuarioService } from '../../share/services/usuario.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../share/authentication.service';
import { PedidoService } from '../../share/services/pedido.service';

@Component({
  selector: 'app-resena-form',
  standalone: false,
  templateUrl: './resena-form.html',
  styleUrl: './resena-form.css',
})
export class ResenaForm implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  @Input() productoId!: number;
  @Input() usuarioId!: number;
  @Output() resenaGuardada = new EventEmitter<ResenaModel>();
  private authService = inject(AuthenticationService);

  formResena!: FormGroup;
  estrellas = [1, 2, 3, 4, 5];
  nombreUsuario = this.authService.currentUserSignal;
  yaComprado: boolean = false;

  fechaActual: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private resenaService: ResenaService,
    private usuarioService: UsuarioService,
    private noti: NotificationService,
    private translate: TranslateService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formResena = this.fb.group({
      id: [null],
      producto_id: [this.productoId, [Validators.required]],
      usuario_id: [this.nombreUsuario()?.id, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      visible: [true, [Validators.required]],
      comentario: [null, [Validators.required, Validators.minLength(5)]],
      valoracion: [
        0,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });
  }

  seleccionarEstrella(valor: number): void {
    this.formResena.patchValue({ valoracion: valor });
  }

  submitResena() {
    if (this.formResena.invalid) {
      this.noti.error(
        this.translate.instant('RESENAS_NOTI.INVALIDA_TITULO'),
        this.translate.instant('RESENAS_NOTI.INVALIDA_MENSAJE'),
        4000
      );
      return;
    }
    // Verificar si el usuario ya ha realizado un pedido del producto
    this.pedidoService
      .verificarProductoComprado(this.usuarioId, this.productoId)
      .subscribe({
        next: (res) => {
          this.yaComprado = res;
          console.log('Producto comprado:', this.yaComprado);
          console.log(this.formResena.value);
          if (this.yaComprado) {
            this.resenaService
              .create(this.formResena.value)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: any) => {
                this.noti.success(
                  this.translate.instant('RESENAS_TEXT.CREADA_TITULO'),
                  this.translate.instant('RESENAS_TEXT.CREADA_MENSAJE', {
                    id: data.id,
                  }),
                  3000
                );
                this.resenaGuardada.emit(data);

                this.formResena.patchValue({
                  producto_id: this.productoId,
                  usuario_id: this.nombreUsuario()?.id,
                  fecha: new Date(),
                  visible: true,
                  valoracion: 0,
                });
                this.formResena.reset();
              });
          } else {
            this.noti.error(
              this.translate.instant('RESENAS_TEXT.NO_COMPRO_TITULO'),
              this.translate.instant('RESENAS_TEXT.NO_COMPRO_MENSAJE'),
              2000
            );
            return;
          }
        },
        error: (err) => {
          console.error('Error al verificar si el producto fue comprado', err);
        },
      });

      
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
