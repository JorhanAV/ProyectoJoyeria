import { Injectable } from '@angular/core';
import { ProductoModel } from '../models/ProductoModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends BaseAPI<ProductoModel> {

  constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointProducto);
      }
}



