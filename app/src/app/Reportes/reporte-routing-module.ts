import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentas } from './Reporte-ventas/reporte-ventas';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  {
    path: 'reporte-ventas',
    component: ReporteVentas,
    canActivate: [authGuard],
    data: { roles: ['ADMIN']
  }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteRoutingModule {}
