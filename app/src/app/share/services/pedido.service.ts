import { Injectable } from '@angular/core';
import { PedidoModel } from '../models/PedidoModel';
import { BaseAPI } from '../base-api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidoService extends BaseAPI<PedidoModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointPedido);
  }

  apiUrl = environment.apiURL;

  verificarProductoComprado(usuarioId: number, productoId: number): Observable<boolean> {
  return this.http.get<number[]>(
    `${this.apiUrl}/${environment.endPointPedido}/usuario/${productoId}`
  ).pipe(
    map((usuarioIds: number[]) => usuarioIds.includes(usuarioId))
  );
}

}
