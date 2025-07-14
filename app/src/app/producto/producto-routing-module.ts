import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndex } from './producto-index/producto-index';
import { ProductoDetail } from './producto-detail/producto-detail';
import { ProductoAdmin } from './producto-admin/producto-admin';
import { ProductoForm } from './producto-form/producto-form';

const routes: Routes = [
  { path: 'productos', component: ProductoIndex },
  { path: 'producto-admin', component: ProductoAdmin },
  { path: 'producto/create', component: ProductoForm },
  { path: 'producto/:id', component: ProductoDetail },
  { path: 'producto/update/:id', component: ProductoForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoRoutingModule {}
