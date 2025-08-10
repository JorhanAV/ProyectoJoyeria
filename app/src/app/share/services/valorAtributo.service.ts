import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ValorAtributoModel } from '../models/ValorAtributoModel';

@Injectable({
  providedIn: 'root',
})
export class ValorAtributoModelService extends BaseAPI<ValorAtributoModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointValorAtributo);
  }
}
