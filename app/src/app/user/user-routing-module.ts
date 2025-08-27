import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLogin } from './user-login/user-login';
import { UserCreate } from './user-create/user-create';
import { UserUpdate } from './user-update/user-update';

const routes: Routes = [
  { path: 'user-login', component: UserLogin },
  { path: 'user-create', component: UserCreate },
  { path: 'user-profile', component: UserUpdate }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
