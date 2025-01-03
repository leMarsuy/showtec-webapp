import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutDeliveryComponent } from './out-delivery.component';
import { editOutDeliveryGuard } from './out-delivery.guard';

const routes: Routes = [
  {
    path: '',
    component: OutDeliveryComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/out-delivery-list/out-delivery-list.module').then(
            (m) => m.OutDeliveryListModule,
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/create-out-delivery/create-out-delivery.module').then(
            (m) => m.CreateOutDeliveryModule,
          ),
      },
      {
        path: 'edit/:_id',
        canActivate: [editOutDeliveryGuard],
        loadChildren: () =>
          import('./pages/edit-out-delivery/edit-out-delivery.module').then(
            (m) => m.EditOutDeliveryModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutDeliveryRoutingModule {}
