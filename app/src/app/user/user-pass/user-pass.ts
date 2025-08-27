import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../share/services/usuario.service';
import { AuthenticationService } from '../../share/authentication.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';
import { passwordStrengthValidator } from '../../share/custom-validators';

@Component({
  selector: 'app-user-pass',
  standalone: false,
  templateUrl: './user-pass.html',
  styleUrl: './user-pass.css',
})
export class UserPass {
  passForm!: FormGroup;
  idUsuario!: number;
  errorActualIncorrecta = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private auth: AuthenticationService,
    private noti: NotificationService,
    private translate: TranslateService

  ) {}

  ngOnInit(): void {
    this.idUsuario = this.auth.currentUserSignal()?.id!;
    this.passForm = this.fb.group(
      {
        actual: ['', Validators.required],
        nueva: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator]],
        confirmar: ['', Validators.required],
      },
      { validators: this.validarCoincidencia }
    );
  }

  validarCoincidencia(form: FormGroup) {
    const nueva = form.get('nueva')?.value;
    const confirmar = form.get('confirmar')?.value;
    return nueva === confirmar ? null : { noCoincide: true };
  }

  guardar() {
    if (this.passForm.valid) {
      const { actual, nueva } = this.passForm.value;

      this.usuarioService
        .cambiarContrasena(this.idUsuario, actual, nueva)
        .subscribe({
          next: () => {
            this.noti.success(
              'Contraseña actualizada',
              'Tu nueva contraseña ha sido guardada',
              2000,
              '/inicio'
            );
            this.errorActualIncorrecta = false;
          },
          error: (err) => {
            if (err.status === 400) {
              this.errorActualIncorrecta = true;
              this.noti.error(
                'Error',
                this.translate.instant('USER_TEXT.ERROR_CONTRASENA_INCORRECTA'),
                2000
              );
            }
          },
        });
    }
  }
}
