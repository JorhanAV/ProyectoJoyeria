import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NameValue {
  name: string; // e.g. '2025-08-01' o '2025-08'
  value: number;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private apiUrl = 'http://localhost:3000/reporte';

  constructor(private http: HttpClient) {}

  getVentasPorDia(params: {
    fechaInicio?: string; // 'YYYY-MM-DD'
    fechaFin?: string;    // 'YYYY-MM-DD'
  }): Observable<NameValue[]> {
    let p = new HttpParams();
    if (params.fechaInicio) p = p.set('fechaInicio', params.fechaInicio);
    if (params.fechaFin) p = p.set('fechaFin', params.fechaFin);
    return this.http.get<NameValue[]>(`${this.apiUrl}/ventas-dia`, { params: p });
  }

  getVentasPorMes(params: {
    anio?: number;
    mes?: number; // 1-12 (opcional)
  }): Observable<NameValue[]> {
    let p = new HttpParams();
    if (params.anio != null) p = p.set('anio', params.anio);
    if (params.mes != null) p = p.set('mes', params.mes);
    return this.http.get<NameValue[]>(`${this.apiUrl}/ventas-mes`, { params: p });
  }

  getPedidosPorEstado(params: {
    anio?: number;
    mes?: number;
    estado?: string; // PendienteDePago|Pagado|EnPreparacion|Entregado
  }): Observable<NameValue[]> {
    let p = new HttpParams();
    if (params.anio != null) p = p.set('anio', params.anio);
    if (params.mes != null) p = p.set('mes', params.mes);
    if (params.estado) p = p.set('estado', params.estado);
    return this.http.get<NameValue[]>(`${this.apiUrl}/pedidos-estado`, { params: p });
  }

  getTopProductos(params?: { anio?: number; mes?: number }): Observable<NameValue[]> {
    let p = new HttpParams();
    if (params?.anio != null) p = p.set('anio', params.anio);
    if (params?.mes != null) p = p.set('mes', params.mes);
    return this.http.get<NameValue[]>(`${this.apiUrl}/top-productos`, { params: p });
  }

  getUltimasResenas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ultimas-resenas`);
  }
}
