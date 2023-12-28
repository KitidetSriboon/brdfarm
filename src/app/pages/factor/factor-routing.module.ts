import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FactorPage } from './factor.page';

const routes: Routes = [
  {
    path: '',
    component: FactorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactorPageRoutingModule {}
