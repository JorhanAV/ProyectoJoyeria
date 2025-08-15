import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionIndex } from './promocion-index/promocion-index';
import { PromocionAdmin } from './promocion-admin/promocion-admin';
import { PromocionDetail } from './promocion-detail/promocion-detail';
import { PromocionForm } from './promocion-form/promocion-form';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  {path: 'promocion', 
    component: PromocionIndex,
    canActivate: [authGuard],
    data: { roles: ['USER', 'ADMIN'] }
  },
  {path: 'promocion-admin',
    component: PromocionAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {path:'promocion/create',
    component:PromocionForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {path:'promocion/:id',
    component:PromocionDetail,
    canActivate: [authGuard],
    data: { roles: ['USER', 'ADMIN'] }
  },
  {path:'promocion/update/:id',
    component:PromocionForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromocionesRoutingModule { }
