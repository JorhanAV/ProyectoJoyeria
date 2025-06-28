import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResenaIndex } from './resena-index/resena-index';
import { ResenaDetail } from './resena-detail/resena-detail';

const routes: Routes = [
  {path:'resena', component: ResenaIndex},
  {path:'resena/:id', component: ResenaDetail}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResenaRoutingModule { }
