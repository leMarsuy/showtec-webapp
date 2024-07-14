import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOutDeliveryComponent } from './create-out-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: CreateOutDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateOutDeliveryRoutingModule {}
