import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddActivityPage } from './add-activity.page';

const routes: Routes = [
  {
    path: '',
    component: AddActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddActivityPageRoutingModule {}
