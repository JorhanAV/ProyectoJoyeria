import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing-module';
import { PedidoAdmin } from './pedido-admin/pedido-admin';
import { PedidoDetail } from './pedido-detail/pedido-detail';
import { PedidoIndex } from './pedido-index/pedido-index';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    PedidoAdmin,
    PedidoDetail,
    PedidoIndex
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ]
})
export class PedidosModule { }
