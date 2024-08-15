import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditSoaRoutingModule } from './edit-soa-routing.module';
import { EditSoaComponent } from './edit-soa.component';
import { SoaFormModule } from '@app/shared/forms/soa-form/soa-form.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [EditSoaComponent],
  imports: [CommonModule, EditSoaRoutingModule, SoaFormModule, MatIconModule],
})
export class EditSoaModule {}
