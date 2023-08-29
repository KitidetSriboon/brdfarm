import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowActivityPage } from './show-activity.page';

const routes: Routes = [
  {
    path: '',
    component: ShowActivityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowActivityPageRoutingModule {}
