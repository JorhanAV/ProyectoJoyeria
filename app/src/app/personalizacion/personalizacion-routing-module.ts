import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalizacionAdmin } from './personalizacion-admin/personalizacion-admin';
import { authGuard } from '../share/auth.guard';
import { PersonalizacionForm } from './personalizacion-form/personalizacion-form';
import { PersonalizacionIndex } from './personalizacion-index/personalizacion-index';

const routes: Routes = [
  {
    path: 'personalizacion-admin',
    component: PersonalizacionAdmin,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'personalizacion-form',
    component: PersonalizacionForm,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'personalizacion-index',
    component: PersonalizacionIndex,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalizacionRoutingModule {}
