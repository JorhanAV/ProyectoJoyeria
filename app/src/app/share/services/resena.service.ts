import { Injectable } from '@angular/core';

import { BaseAPI } from '../base-api';
import { ResenaModel } from '../models/ResenaModel';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResenaService extends BaseAPI<ResenaModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.endPointResena);
  }
}
