import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResenasRoutingModule } from './resenas-routing-module';
import { ResenaIndex } from './resena-index/resena-index';
import { ResenaDetail } from './resena-detail/resena-detail';
import { ResenaAdmin } from './resena-admin/resena-admin';


@NgModule({
  declarations: [
    ResenaIndex,
    ResenaDetail,
    ResenaAdmin
  ],
  imports: [
    CommonModule,
    ResenasRoutingModule
  ]
})
export class ResenasModule { }
