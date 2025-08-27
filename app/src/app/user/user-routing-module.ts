import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLogin } from './user-login/user-login';
import { UserCreate } from './user-create/user-create';
import { UserUpdate } from './user-update/user-update';
import { UserAdmin } from './user-admin/user-admin';

const routes: Routes = [
  { path: 'user-login', component: UserLogin },
  { path: 'user-create', component: UserCreate },
  { path: 'user-profile/:id', component: UserUpdate },
  { path: 'user-profile', component: UserUpdate },
  { path: 'user-admin', component: UserAdmin}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
