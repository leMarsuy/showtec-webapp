import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoaListComponent } from './soa-list.component';

const routes: Routes = [
  {
    path: '',
    component: SoaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoaListRoutingModule {}
