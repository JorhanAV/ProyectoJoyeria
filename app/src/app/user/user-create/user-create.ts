import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../share/authentication.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';
import {
  passwordStrengthValidator,
  customEmailValidator,
} from '../../share/custom-validators';


@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private notificationService: NotificationService,
    private translate: TranslateService
    
  ) {
    this.registerForm = this.fb.group(
      {
        nombre_usuario: ['', [Validators.required, Validators.minLength(3)]],
        correo: ['', [Validators.required, Validators.email, customEmailValidator]],
        contraseña: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator]],
        confirmarContraseña: ['', Validators.required],
        rol: ['CLIENTE', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // Validador personalizado para comparar contraseñas
  passwordsMatchValidator(
    form: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = form.get('contraseña')?.value;
    const confirmPassword = form.get('confirmarContraseña')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const usuario = this.registerForm.value;
      this.authService.createUser(usuario).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response);
          // Podés redirigir o mostrar un mensaje de éxito
          this.notificationService.success(
            this.translate.instant('USER_TEXT.CREAR_USUARIO_TITULO'),
            this.translate.instant('USER_TEXT.CREAR_USUARIO_MENSAJE'),
            2000,
            '/user-login'
          );
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
        },
      });
    } else {
      console.warn('Formulario inválido');
    }
  }
}
