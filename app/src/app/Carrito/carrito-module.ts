import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarritoRoutingModule } from './carrito-routing-module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CarritoComponent } from './Carrito-Component/carrito-component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CarritoComponent,
  ],
  imports: [
    CommonModule,
    CarritoRoutingModule,
    TranslateModule.forChild(),
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    FormsModule
  ]
})
export class PedidosModule { }
