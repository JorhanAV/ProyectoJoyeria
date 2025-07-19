import {
  Component,
  EventEmitter,
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

  formResena!: FormGroup;
  estrellas = [1, 2, 3, 4, 5];
  nombreUsuario: string = '';

  constructor(
    private fb: FormBuilder,
    private resenaService: ResenaService,
    private usuarioService: UsuarioService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.obtenerUsuario();
  }

  private initForm() {
    this.formResena = this.fb.group({
      id: [null],
      producto_id: [this.productoId, [Validators.required]],
      usuario_id: [this.usuarioId, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      visible: [true, [Validators.required]],
      comentario: [null, [Validators.required, Validators.minLength(5)]],
      valoracion: [
        0,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
    });
  }

  obtenerUsuario() {
    this.usuarioService.getById(this.usuarioId).subscribe((usuario) => {
      this.nombreUsuario = usuario.nombre_usuario;
    });
  }

  seleccionarEstrella(valor: number): void {
    this.formResena.patchValue({ valoracion: valor });
  }

  submitResena() {
    if (this.formResena.invalid) {
      this.noti.error(
        'Reseña inválida',
        'Escribí un comentario y seleccioná la valoración.',
        4000
      );
      return;
    }

    this.resenaService
      .create(this.formResena.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.noti.success('Crear Reseña', `Reseña creada: ${data.id}`, 3000);
        this.resenaGuardada.emit(data); // 👈 EMITIR LA NUEVA RESEÑA
      });
    this.formResena.reset();

    this.formResena.patchValue({
      producto_id: this.productoId,
      usuario_id: this.usuarioId,
      fecha: new Date(),
      visible: true,
      valoracion: 0,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
