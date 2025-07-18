import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing-module';
import { ProductoIndex } from './producto-index/producto-index';
import { ProductoDetail } from './producto-detail/producto-detail';
import { ProductoAdmin } from './producto-admin/producto-admin';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { ResenaForm } from '../resenas/resena-form/resena-form';
import { ProductoForm } from './producto-form/producto-form';

@NgModule({
  declarations: [
    ProductoIndex,
    ProductoDetail,
    ProductoAdmin,
    ResenaForm,
    ProductoForm
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
    MatRadioModule,
    MatDividerModule,
    MatTooltipModule,
    ReactiveFormsModule
  ]
})
export class ProductoModule { }
