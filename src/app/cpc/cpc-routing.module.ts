import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CpcPage } from './cpc.page';

const routes: Routes = [
  {
    path: '',
    component: CpcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CpcPageRoutingModule {}
