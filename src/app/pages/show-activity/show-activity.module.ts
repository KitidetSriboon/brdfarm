import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowActivityPageRoutingModule } from './show-activity-routing.module';

import { ShowActivityPage } from './show-activity.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowActivityPageRoutingModule,
  ],
  declarations: [ShowActivityPage]
})
export class ShowActivityPageModule {}
