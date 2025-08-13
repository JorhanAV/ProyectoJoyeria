import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserLogin } from './user-login/user-login';
import { UserCreate } from './user-create/user-create';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UserLogin, UserCreate],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    UserRoutingModule,
  ],
})
export class UserModule {}
