import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayeesComponent } from './payees.component';

const routes: Routes = [
  {
    path: '',
    component: PayeesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayeesRoutingModule {}
