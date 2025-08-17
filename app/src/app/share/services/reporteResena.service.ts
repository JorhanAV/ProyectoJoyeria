import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ReporteResenaModel } from '../models/ReporteResenaModel';

@Injectable({
  providedIn: 'root',
})
export class ReporteResenaService extends BaseAPI<ReporteResenaModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointReporteResena);
  }
}
