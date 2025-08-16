import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoIndex } from './pedido-index/pedido-index';
import { PedidoAdmin } from './pedido-admin/pedido-admin';
import { PedidoDetail } from './pedido-detail/pedido-detail';
import { CarritoComponent } from './Carrito-Component/carrito-component';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  {path: 'pedidos', 
    component: PedidoIndex,
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  {path: 'pedido-admin', 
    component: PedidoAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {path: 'pedido/:id', 
    component: PedidoDetail,
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  {path: 'carrito', 
    component: CarritoComponent,
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
