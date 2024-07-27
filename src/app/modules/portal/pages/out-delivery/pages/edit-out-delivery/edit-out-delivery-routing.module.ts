import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditOutDeliveryComponent } from './edit-out-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: EditOutDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditOutDeliveryRoutingModule {}
