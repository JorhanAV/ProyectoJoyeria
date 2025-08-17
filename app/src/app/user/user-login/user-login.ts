import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../share/notification-service';
import { AuthenticationService } from '../../share/authentication.service';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private authService: AuthenticationService
  ) {
    this.reactiveForm();
  }

  reactiveForm() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
    });
  }

  onReset() {
    this.loginForm.reset();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    //Login
    //Obtener los datos del formulario
    const credentials = this.loginForm.value;
    console.log(credentials);
    this.authService.loginUser(credentials).subscribe({
      next: () => {
        this.notification.success('Inicio de sesión', 'Bienvenido', 1000, '/inicio')
      },
      error: (error) => {
        console.log('Error inicio de sesión ', error)
        let message = 'Error al iniciar sesión. Por favor, intente de nuevo'
        if (error.status === 401) {
          message = 'Credenciales incorrectas. Verifique su email y contraseña'
        }
        this.notification.error('Error de autenticación', message)
      }
    })
  }
}
