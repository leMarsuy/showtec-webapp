import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSoaRoutingModule } from './create-soa-routing.module';
import { CreateSoaComponent } from './create-soa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CreateSoaComponent],
  imports: [
    CommonModule,
    CreateSoaRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ],
})
export class CreateSoaModule {}
