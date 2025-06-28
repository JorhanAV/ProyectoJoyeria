import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing-module';
import { ProductoIndex } from './producto-index/producto-index';
import { ProductoDetail } from './producto-detail/producto-detail';
import { ProductoAdmin } from './producto-admin/producto-admin';


@NgModule({
  declarations: [
    ProductoIndex,
    ProductoDetail,
    ProductoAdmin
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule
  ]
})
export class ProductoModule { }
