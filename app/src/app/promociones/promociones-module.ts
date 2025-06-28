import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromocionesRoutingModule } from './promociones-routing-module';
import { PromocionIndex } from './promocion-index/promocion-index';
import { PromocionDetail } from './promocion-detail/promocion-detail';
import { PromocionAdmin } from './promocion-admin/promocion-admin';


@NgModule({
  declarations: [
    PromocionIndex,
    PromocionDetail,
    PromocionAdmin
  ],
  imports: [
    CommonModule,
    PromocionesRoutingModule
  ]
})
export class PromocionesModule { }
