import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditSoaRoutingModule } from './edit-soa-routing.module';
import { EditSoaComponent } from './edit-soa.component';
import { SoaFormModule } from '@app/shared/forms/soa-form/soa-form.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
  declarations: [EditSoaComponent],
  imports: [
    CommonModule,
    EditSoaRoutingModule,
    SoaFormModule,
    MatIconModule,
    MatTooltipModule,
    CdkMenuModule,
  ],
})
export class EditSoaModule {}
