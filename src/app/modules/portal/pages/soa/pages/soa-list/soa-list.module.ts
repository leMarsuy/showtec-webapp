import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoaListRoutingModule } from './soa-list-routing.module';
import { SoaListComponent } from './soa-list.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { PdfViewerModule } from '@app/shared/components/pdf-viewer/pdf-viewer.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SoaListComponent],
  imports: [
    CommonModule,
    SoaListRoutingModule,
    TableModule,
    PdfViewerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SoaListModule {}
