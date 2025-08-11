import { Injectable } from '@angular/core';
import { PedidoModel } from '../models/PedidoModel';
import { BaseAPI } from '../base-api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PedidoService extends BaseAPI<PedidoModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointPedido);
  }
  pagarpedido(pedidoId: number, adminId: number) {
    const url = `${environment.apiURL}/${environment.endPointPedido}/${pedidoId}/bitacora`;

    const body = {
      estado: 'Pagado',
      admin_id: adminId,
    };

    return this.http.post(url, body);
  }
}
