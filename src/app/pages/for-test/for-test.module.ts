import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForTestPageRoutingModule } from './for-test-routing.module';

import { ForTestPage } from './for-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForTestPageRoutingModule
  ],
  declarations: [ForTestPage]
})
export class ForTestPageModule {}
