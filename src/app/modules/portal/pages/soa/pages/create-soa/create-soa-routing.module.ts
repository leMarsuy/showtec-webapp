import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSoaComponent } from './create-soa.component';

const routes: Routes = [
  {
    path: '',
    component: CreateSoaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSoaRoutingModule {}
