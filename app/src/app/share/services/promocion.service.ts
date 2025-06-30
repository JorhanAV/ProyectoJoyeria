import { Injectable } from '@angular/core';
import { PromocionModel } from '../models/PromocionModel';
import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromocionService extends BaseAPI<PromocionModel> {

  constructor(public httpClient: HttpClient) { 
    super(httpClient, environment.endPointPromocion); // Verificá este endpoint si es correcto
  }

  // Método personalizado para obtener productos con descuento de una promoción
  getAllProductsWithPromo(id: number) {
    return this.httpClient.get<any[]>(`${this.urlAPI}/promocion/getallProductswithPromo/${id}`);
  }
}
