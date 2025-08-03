import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarritoComponent } from './Carrito-Component/carrito-component';

const routes: Routes = [
  {path: 'carrito', component: CarritoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarritoRoutingModule { }
