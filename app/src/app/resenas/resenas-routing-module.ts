import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResenaIndex } from './resena-index/resena-index';
import { ResenaDetail } from './resena-detail/resena-detail';
import { ResenaAdmin } from './resena-admin/resena-admin';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  {path: 'resena', component: ResenaIndex, canActivate: [authGuard], data: { roles: ['CLIENTE', 'ADMIN'] }},
  {path: 'resena-admin', component: ResenaAdmin, canActivate: [authGuard], data: { roles: ['ADMIN'] }},
  {path:'resena/:id', component:ResenaDetail, canActivate: [authGuard], data: { roles: ['CLIENTE', 'ADMIN'] }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResenasRoutingModule { }
