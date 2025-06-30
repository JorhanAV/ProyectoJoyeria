import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResenaIndex } from './resena-index/resena-index';
import { ResenaDetail } from './resena-detail/resena-detail';
import { ResenaAdmin } from './resena-admin/resena-admin';

const routes: Routes = [
  {path: 'resena', component: ResenaIndex},
  {path: 'resena-admin',component: ResenaAdmin},
  {path:'resena/:id',component:ResenaDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResenasRoutingModule { }
