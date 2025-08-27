import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/UsuarioModel';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseAPI<UsuarioModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointUsuario);
  }

  cambiarContrasena(id: number, actual: string, nueva: string) {
    return this.http.put(`${environment.apiURL}/usuario/${id}/password`, { actual, nueva });
  }

}
