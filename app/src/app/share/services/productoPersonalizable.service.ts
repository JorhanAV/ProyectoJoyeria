import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ProductoPersonalizableModel } from '../models/ProductoPersonalizableModel';
import { ProductoPersonalizableCreateModel } from '../models/ProductoPersonalizableDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoPersonalizableService extends BaseAPI<ProductoPersonalizableModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointProductoPersonalizable);
  }

   createProductoPersonalizable(data: ProductoPersonalizableCreateModel): Observable<any> {
    return this.http.post(`${this.urlAPI}/${environment.endPointProductoPersonalizable}`, data);
  }
}
