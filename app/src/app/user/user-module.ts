import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserLogin } from './user-login/user-login';
import { UserCreate } from './user-create/user-create';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserUpdate } from './user-update/user-update';
import { UserPass } from './user-pass/user-pass';
import { UserAdmin } from './user-admin/user-admin';

@NgModule({
  declarations: [UserLogin, UserCreate, UserUpdate, UserPass, UserAdmin],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    UserRoutingModule,
  ],
})
export class UserModule {}
