import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRegistrationRoutingModule } from './customer-registration-routing.module';
import { CustomerRegistrationComponent } from './customer-registration.component';

@NgModule({
  declarations: [CustomerRegistrationComponent],
  imports: [CommonModule, CustomerRegistrationRoutingModule],
})
export class CustomerRegistrationModule {}
