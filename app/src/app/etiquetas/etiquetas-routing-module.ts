import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../share/auth.guard';
import { etiquetasAdmin } from './etiquetas-admin/etiquetas-admin';
import { etiquetasForm } from './etiquetas-form/etiquetas-form';

const routes: Routes = [
  {path: 'etiquetas-admin',
    component: etiquetasAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {path:'etiquetas/create',
    component:etiquetasForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {path:'etiquetas/update/:id',
    component:etiquetasForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class etiquetasRoutingModule { }
