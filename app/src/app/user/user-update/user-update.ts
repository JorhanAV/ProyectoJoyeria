import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { AuthenticationService } from '../../share/authentication.service';
import { UsuarioService } from '../../share/services/usuario.service';
import { NotificationService } from '../../share/notification-service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { emailExistsValidatorUpdate } from '../../share/custom-validators';

@Component({
  selector: 'app-user-update',
  standalone: false,
  templateUrl: './user-update.html',
  styleUrl: './user-update.css',
})
export class UserUpdate {
  perfilForm!: FormGroup;
  idUsuario!: number;
  esAdminLogueado = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsuarioService,
    private auth: AuthenticationService,
    private noti: NotificationService,
    private translate: TranslateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idUsuario = idParam
      ? Number(idParam)
      : this.auth.currentUserSignal()?.id!;
    this.esAdminLogueado = this.auth.currentUserSignal()?.rol === 'ADMIN';

    this.userService.getById(this.idUsuario).subscribe((usuario) => {
      const esCorreoDelUsuarioLogueado =
        this.auth.currentUserSignal()?.correo === usuario.correo;

      const correoControl = esCorreoDelUsuarioLogueado
        ? [usuario.correo, [Validators.required, Validators.email]]
        : [
            usuario.correo,
            [Validators.required, Validators.email],
            [emailExistsValidatorUpdate(this.userService, this.idUsuario)],
          ];

      this.perfilForm = this.fb.group({
        id: [usuario.id],
        nombre_usuario: [usuario.nombre_usuario, Validators.required],
        correo: correoControl,
        rol: [
          { value: usuario.rol, disabled: !this.esAdminLogueado },
          Validators.required,
        ],
      });
    });
  }

  guardar() {
    if (this.perfilForm.valid) {
      const data = {
        id: this.idUsuario,
        ...this.perfilForm.getRawValue(),
      };

      this.userService.update(data).subscribe(() => {
        const esAdminEditando = !!this.route.snapshot.paramMap.get('id');
        const destino = esAdminEditando ? '/user-admin' : '/inicio';

        this.noti.success(
          this.translate.instant('USER_TEXT.ACTUALIZAR_PERFIL_TITULO'),
          this.translate.instant('USER_TEXT.ACTUALIZAR_PERFIL_MENSAJE'),
          2000,
          destino
        );
      });
    }
  }
}
