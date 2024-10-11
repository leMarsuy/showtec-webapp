import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSoaRoutingModule } from './create-soa-routing.module';
import { CreateSoaComponent } from './create-soa.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SoaFormModule } from '@app/shared/forms/soa-form/soa-form.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [CreateSoaComponent],
  imports: [
    CommonModule,
    CreateSoaRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SoaFormModule,
  ],
})
export class CreateSoaModule {}
