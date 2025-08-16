import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentas } from './Reporte-ventas/reporte-ventas';

const routes: Routes = [
  {
    path: 'reporte-ventas',
    component: ReporteVentas,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteRoutingModule {}
