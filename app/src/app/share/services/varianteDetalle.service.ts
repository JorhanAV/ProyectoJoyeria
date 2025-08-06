import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { ResenaModel } from '../models/ResenaModel';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { VarianteDetalleModel } from '../models/VarianteDetalleModel';
import { VarianteDetalleBatchDTO } from '../models/VarianteDetalleDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VarianteDetalleService extends BaseAPI<VarianteDetalleModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointVarianteDetalle);
  }

  createBatch(data: VarianteDetalleBatchDTO): Observable<any> {
    return this.http.post(
      `${this.urlAPI}/${environment.endPointVarianteDetalle}`,
      data
    );
  }
}
