import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoaComponent } from './soa.component';

const routes: Routes = [
  {
    path: '',
    component: SoaComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/soa-list/soa-list.module').then(
            (m) => m.SoaListModule
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/create-soa/create-soa.module').then(
            (m) => m.CreateSoaModule
          ),
      },
      {
        path: 'edit/:_id',
        loadChildren: () =>
          import('./pages/edit-soa/edit-soa.module').then(
            (m) => m.EditSoaModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoaRoutingModule {}
