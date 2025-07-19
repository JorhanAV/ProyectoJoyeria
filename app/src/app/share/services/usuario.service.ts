import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/UsuarioModel';


@Injectable({
  providedIn: 'root'
})


export class UsuarioService extends BaseAPI<UsuarioModel> {

   constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointUsuario);
      }

}
