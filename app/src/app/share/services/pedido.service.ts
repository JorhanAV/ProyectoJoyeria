import { Injectable } from '@angular/core';
import { PedidoModel } from '../models/PedidoModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends BaseAPI<PedidoModel> {

  constructor(httpClient: HttpClient) { 
        super(
          httpClient,
          environment.endPointPedido);
      }
}

