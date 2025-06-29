import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionIndex } from './promocion-index/promocion-index';
import { PromocionAdmin } from './promocion-admin/promocion-admin';
import { PromocionDetail } from './promocion-detail/promocion-detail';

const routes: Routes = [
  {path: 'promocion', component: PromocionIndex},
  {path: 'promocion-admin',component: PromocionAdmin},
  {path:'promocion/:id',component:PromocionDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromocionesRoutingModule { }
