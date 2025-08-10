import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndex } from './pedido-index/pedido-index';
import { PedidoAdmin } from './pedido-admin/pedido-admin';
import { PedidoDetail } from './pedido-detail/pedido-detail';
import { CarritoComponent } from './Carrito-Component/carrito-component';

const routes: Routes = [
  {path: 'pedidos', component: PedidoIndex},
    {path: 'pedido-admin', component: PedidoAdmin},
    {path: 'pedido/:id', component: PedidoDetail},
      {path: 'carrito', component: CarritoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
