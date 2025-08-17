import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoIndex } from './producto-index/producto-index';
import { ProductoDetail } from './producto-detail/producto-detail';
import { ProductoAdmin } from './producto-admin/producto-admin';
import { ProductoForm } from './producto-form/producto-form';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'productos', 
    component: ProductoIndex,
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },

  { path: 'producto-admin', 
    component: ProductoAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: 'producto/create', 
    component: ProductoForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: 'producto/:id', 
    component: ProductoDetail,
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] }
  },
  { path: 'producto/update/:id', 
    component: ProductoForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoRoutingModule {}
