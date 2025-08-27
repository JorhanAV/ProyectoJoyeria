import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../share/services/usuario.service';
import { AuthenticationService } from '../../share/authentication.service';
import { NotificationService } from '../../share/notification-service';

@Component({
  selector: 'app-user-pass',
  standalone: false,
  templateUrl: './user-pass.html',
  styleUrl: './user-pass.css'
})
export class UserPass {
passForm!: FormGroup;
  idUsuario!: number;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private auth: AuthenticationService,
    private noti: NotificationService
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.auth.currentUserSignal()?.id!;
    this.passForm = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required]
    }, { validators: this.validarCoincidencia });
  }

  validarCoincidencia(form: FormGroup) {
    const nueva = form.get('nueva')?.value;
    const confirmar = form.get('confirmar')?.value;
    return nueva === confirmar ? null : { noCoincide: true };
  }

  guardar() {
    if (this.passForm.valid) {
      const { actual, nueva } = this.passForm.value;
      this.usuarioService.cambiarContrasena(this.idUsuario, actual, nueva).subscribe(() => {
        this.noti.success('Contraseña actualizada', 'Tu nueva contraseña ha sido guardada', 2000, '/inicio');
      });
    }
  }
}
