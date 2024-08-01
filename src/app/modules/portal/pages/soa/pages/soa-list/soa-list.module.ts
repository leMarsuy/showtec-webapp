import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoaListRoutingModule } from './soa-list-routing.module';
import { SoaListComponent } from './soa-list.component';
import { TableModule } from '@app/shared/components/table/table.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PdfViewerModule } from '@app/shared/components/pdf-viewer/pdf-viewer.module';

@NgModule({
  declarations: [SoaListComponent],
  imports: [CommonModule, SoaListRoutingModule, TableModule, PdfViewerModule],
})
export class SoaListModule {}
