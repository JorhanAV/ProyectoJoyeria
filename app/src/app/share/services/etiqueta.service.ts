import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EtiquetaModel } from '../models/EtiquetaModel';


@Injectable({
  providedIn: 'root'
})


export class EtiquetaService extends BaseAPI<EtiquetaModel> {

   constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointEtiqueta);
      }

}
