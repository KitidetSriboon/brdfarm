import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancesPage } from './finances.page';

const routes: Routes = [
  {
    path: '',
    component: FinancesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancesPageRoutingModule {}
