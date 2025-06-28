import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing-module';
import { PedidoAdmin } from './pedido-admin/pedido-admin';
import { PedidoDetail } from './pedido-detail/pedido-detail';
import { PedidoIndex } from './pedido-index/pedido-index';


@NgModule({
  declarations: [
    PedidoAdmin,
    PedidoDetail,
    PedidoIndex
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule
  ]
})
export class PedidosModule { }
