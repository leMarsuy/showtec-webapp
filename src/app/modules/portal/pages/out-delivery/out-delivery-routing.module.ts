import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutDeliveryComponent } from './out-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: OutDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutDeliveryRoutingModule {}
