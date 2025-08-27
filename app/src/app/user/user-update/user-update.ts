import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { AuthenticationService } from '../../share/authentication.service';
import { UsuarioService } from '../../share/services/usuario.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-update',
  standalone: false,
  templateUrl: './user-update.html',
  styleUrl: './user-update.css',
})
export class UserUpdate {
  perfilForm!: FormGroup;
   idUsuario!: number;
  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private auth: AuthenticationService,
    private noti: NotificationService,
    private translate: TranslateService
  ) {}

 ngOnInit() {
    this.idUsuario = this.auth.currentUserSignal()?.id!;
    this.userService.getById(this.idUsuario).subscribe((usuario) => {
      this.perfilForm = this.fb.group({
        id: [usuario.id], // 👈 incluimos el id en el form si lo necesitás en el body
        nombre_usuario: [usuario.nombre_usuario, Validators.required],
        correo: [usuario.correo, [Validators.required, Validators.email]],
        rol: [{ value: usuario.rol, disabled: true }],
      });
    });
  }

guardar() {
    if (this.perfilForm.valid) {
      const data = {
        id: this.idUsuario,
        ...this.perfilForm.getRawValue()
      };

      this.userService.update(data).subscribe(() => {
        // Mostrar notificación si querés
        this.noti.success(
          this.translate.instant('USER_TEXT.ACTUALIZAR_PERFIL_TITULO'),
          this.translate.instant('USER_TEXT.ACTUALIZAR_PERFIL_MENSAJE'),
          2000,
          '/inicio'
        );
      });
    }
  }
}
