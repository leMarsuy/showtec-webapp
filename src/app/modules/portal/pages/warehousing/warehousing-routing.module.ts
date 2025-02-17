import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousingComponent } from './warehousing.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousingComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousingRoutingModule {}
