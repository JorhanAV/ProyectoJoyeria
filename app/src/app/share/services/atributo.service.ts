import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { AtributoModel } from '../models/AtributoModel';

@Injectable({
  providedIn: 'root',
})
export class AtributoService extends BaseAPI<AtributoModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointAtributo);
  }
}
