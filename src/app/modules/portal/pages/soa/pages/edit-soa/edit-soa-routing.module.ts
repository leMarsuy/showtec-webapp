import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSoaComponent } from './edit-soa.component';

const routes: Routes = [
  {
    path: '',
    component: EditSoaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSoaRoutingModule {}
