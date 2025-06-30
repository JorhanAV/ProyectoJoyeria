import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndex } from './producto-index/producto-index';
import { ProductoDetail } from './producto-detail/producto-detail';
import { ProductoAdmin } from './producto-admin/producto-admin';

const routes: Routes = [
  {path: 'productos', component: ProductoIndex},
  {path: 'producto-admin', component: ProductoAdmin},
  {path: 'producto/:id', component: ProductoDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule { }
