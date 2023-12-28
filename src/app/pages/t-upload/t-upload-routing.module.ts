import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TUploadPage } from './t-upload.page';

const routes: Routes = [
  {
    path: '',
    component: TUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TUploadPageRoutingModule {}
