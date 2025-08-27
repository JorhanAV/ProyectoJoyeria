import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../share/models/UsuarioModel';
import { UsuarioService } from '../../share/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-admin',
  standalone: false,
  templateUrl: './user-admin.html',
  styleUrl: './user-admin.css'
})
export class UserAdmin implements OnInit {
 usuarios: UsuarioModel[] = [];

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.usuarioService.get().subscribe((data: UsuarioModel[]) => {
      this.usuarios = data;
    });
  }

   editarUsuario(id: number) {
    this.router.navigate(['/user-profile',id]);
  }
}
