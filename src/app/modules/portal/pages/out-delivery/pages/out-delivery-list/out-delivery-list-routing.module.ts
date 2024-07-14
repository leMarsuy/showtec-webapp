import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutDeliveryListComponent } from './out-delivery-list.component';

const routes: Routes = [
  {
    path: '',
    component: OutDeliveryListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutDeliveryListRoutingModule {}
