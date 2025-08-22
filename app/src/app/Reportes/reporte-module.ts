import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteRoutingModule } from './reporte-routing-module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AgCharts } from 'ag-charts-angular';
import { ReporteVentas } from './Reporte-ventas/reporte-ventas';
import { AgChartsModule } from 'ag-charts-angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ReporteVentas],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    AgCharts,
    AgChartsModule,
    TranslateModule,
    FormsModule
  ],
})
export class ReporteModule {}
