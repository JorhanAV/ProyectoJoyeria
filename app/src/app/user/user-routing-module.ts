import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLogin } from './user-login/user-login';
import { UserCreate } from './user-create/user-create';
import { UserUpdate } from './user-update/user-update';
import { UserAdmin } from './user-admin/user-admin';
import { UserPass } from './user-pass/user-pass';
import { authGuard } from '../share/auth.guard';

const routes: Routes = [
  { path: 'user-login', component: UserLogin},
  { path: 'user-create', component: UserCreate },
  { path: 'user-profile/:id', component: UserUpdate , canActivate: [authGuard],data: { roles: ['ADMIN'] } },
  { path: 'user-profile', component: UserUpdate , canActivate: [authGuard],data: { roles: ['CLIENTE', 'ADMIN'] } },
  { path: 'user-admin', component: UserAdmin , canActivate: [authGuard],data: { roles: ['ADMIN'] } },
  { path: 'user-pass', component: UserPass , canActivate: [authGuard],data: { roles: ['CLIENTE', 'ADMIN'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
