import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionIndex } from './promocion-index/promocion-index';
import { PromocionAdmin } from './promocion-admin/promocion-admin';
import { PromocionDetail } from './promocion-detail/promocion-detail';
import { PromocionForm } from './promocion-form/promocion-form';

const routes: Routes = [
  {path: 'promocion', component: PromocionIndex},
  {path: 'promocion-admin',component: PromocionAdmin},
  {path:'promocion/create',component:PromocionForm},
  {path:'promocion/:id',component:PromocionDetail},
  {path:'promocion/update/:id',component:PromocionForm}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromocionesRoutingModule { }
