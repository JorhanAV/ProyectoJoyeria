import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CategoriaModel } from '../models/CategoriaModel';


@Injectable({
  providedIn: 'root'
})


export class CategoriaService extends BaseAPI<CategoriaModel> {

   constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointCategoria);
      }

}
